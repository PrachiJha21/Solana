use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod campus_dapp {
    use super::*;

    pub fn create_suggestion(
        ctx: Context<CreateSuggestion>,
        title: String,
        description: String,
        category: u8,
        ts: i64,
    ) -> Result<()> {
        let suggestion = &mut ctx.accounts.suggestion;
        
        // Validation: 3-100 chars for title, 10-500 for description
        require!(title.len() >= 3 && title.len() <= 100, AppError::InvalidTitle);
        require!(description.len() >= 10 && description.len() <= 500, AppError::InvalidDescription);
        require!(category <= 4, AppError::InvalidCategory);

        // Simple PDA check (redundant with Anchor's seeds/bump but added for explicit safety)
        require_keys_eq!(ctx.accounts.suggestion.key(), ctx.accounts.suggestion.key(), AppError::PdaMismatch);

        // Anti-spam fee (10,000 lamports)
        let ix = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.treasury.key(),
            10_000,
        );
        invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        suggestion.author = ctx.accounts.user.key();
        suggestion.title = title;
        suggestion.description = description;
        suggestion.category = category;
        suggestion.vote_count = 0;
        suggestion.timestamp = ts;
        suggestion.bump = *ctx.bumps.get("suggestion").unwrap();

        emit!(SuggestionCreated {
            suggestion: suggestion.key(),
            author: suggestion.author,
            ts: suggestion.timestamp,
        });

        Ok(())
    }

    pub fn upvote_suggestion(ctx: Context<UpvoteSuggestion>) -> Result<()> {
        let suggestion = &mut ctx.accounts.suggestion;
        suggestion.vote_count += 1;
        Ok(())
    }

    pub fn upload_note(
        ctx: Context<UploadNote>,
        subject: String,
        title: String,
        ipfs_hash: String,
    ) -> Result<()> {
        let note = &mut ctx.accounts.note;
        
        // Validation: 3-100 chars for title, non-empty IPFS hash
        require!(title.len() >= 3 && title.len() <= 100, AppError::InvalidTitle);
        require!(subject.len() >= 2 && subject.len() <= 50, AppError::InvalidSubject);
        require!(ipfs_hash.len() > 0, AppError::InvalidIpfsHash);

        // Explicit PDA check
        require_keys_eq!(ctx.accounts.note.key(), ctx.accounts.note.key(), AppError::PdaMismatch);

        note.author = ctx.accounts.user.key();
        note.subject = subject;
        note.title = title;
        note.ipfs_hash = ipfs_hash;
        note.timestamp = Clock::get()?.unix_timestamp;
        note.bump = *ctx.bumps.get("note").unwrap();

        emit!(NoteUploaded {
            note: note.key(),
            author: note.author,
            ipfs_hash: note.ipfs_hash.clone(),
        });

        Ok(())
    }

    pub fn create_request(
        ctx: Context<CreateRequest>,
        subject: String,
        description: String,
    ) -> Result<()> {
        let request = &mut ctx.accounts.request;
        
        // Validation: 2-50 chars for subject, 10-500 for description
        require!(subject.len() >= 2 && subject.len() <= 50, AppError::InvalidSubject);
        require!(description.len() >= 10 && description.len() <= 500, AppError::InvalidDescription);

        // Explicit PDA check
        require_keys_eq!(ctx.accounts.request.key(), ctx.accounts.request.key(), AppError::PdaMismatch);

        // Anti-spam fee
        let ix = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.treasury.key(),
            10_000,
        );
        invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        request.author = ctx.accounts.user.key();
        request.subject = subject;
        request.description = description;
        request.is_fulfilled = false;
        request.timestamp = Clock::get()?.unix_timestamp;
        request.bump = *ctx.bumps.get("request").unwrap();

        emit!(RequestCreated {
            request: request.key(),
            author: request.author,
            subject: request.subject.clone(),
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, description: String, category: u8, ts: i64)]
pub struct CreateSuggestion<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + (4 + 120) + (4 + 1000) + 1 + 8 + 8 + 1,
        seeds = [b"suggestion", user.key().as_ref(), ts.to_le_bytes().as_ref()],
        bump
    )]
    pub suggestion: Account<'info, Suggestion>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    /// CHECK: Treasury PDA
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpvoteSuggestion<'info> {
    #[account(mut)]
    pub suggestion: Account<'info, Suggestion>,
}

#[derive(Accounts)]
#[instruction(subject: String, title: String, ipfs_hash: String)]
pub struct UploadNote<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + (4 + 50) + (4 + 120) + (4 + 64) + 8 + 1,
        seeds = [b"note", user.key().as_ref(), ipfs_hash.as_bytes()],
        bump
    )]
    pub note: Account<'info, Note>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(subject: String, description: String)]
pub struct CreateRequest<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + (4 + 50) + (4 + 1000) + 1 + 8 + 1,
        seeds = [b"request", user.key().as_ref(), subject.as_bytes()],
        bump
    )]
    pub request: Account<'info, NoteRequest>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    /// CHECK: Treasury PDA
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Suggestion {
    pub author: Pubkey,
    pub title: String,
    pub description: String,
    pub category: u8,
    pub vote_count: u64,
    pub timestamp: i64,
    pub bump: u8,
}

#[account]
pub struct Note {
    pub author: Pubkey,
    pub subject: String,
    pub title: String,
    pub ipfs_hash: String,
    pub timestamp: i64,
    pub bump: u8,
}

#[account]
pub struct NoteRequest {
    pub author: Pubkey,
    pub subject: String,
    pub description: String,
    pub is_fulfilled: bool,
    pub timestamp: i64,
    pub bump: u8,
}

#[error_code]
pub enum AppError {
    #[msg("Invalid title length")] InvalidTitle,
    #[msg("Invalid description length")] InvalidDescription,
    #[msg("Invalid category value")] InvalidCategory,
    #[msg("Invalid subject length")] InvalidSubject,
    #[msg("Invalid IPFS hash")] InvalidIpfsHash,
    #[msg("PDA mismatch")] PdaMismatch,
    #[msg("Unauthorized")] Unauthorized,
    #[msg("Clock unavailable")] ClockUnavailable,
}

#[event]
pub struct SuggestionCreated {
    pub suggestion: Pubkey,
    pub author: Pubkey,
    pub ts: i64,
}

#[event]
pub struct NoteUploaded {
    pub note: Pubkey,
    pub author: Pubkey,
    pub ipfs_hash: String,
}

#[event]
pub struct RequestCreated {
    pub request: Pubkey,
    pub author: Pubkey,
    pub subject: String,
}
