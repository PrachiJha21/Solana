use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod campus_dapp {
    use super::*;

    pub fn create_suggestion(
        ctx: Context<CreateSuggestion>,
        title: String,
        description: String,
        category: String,
    ) -> Result<()> {
        let suggestion = &mut ctx.accounts.suggestion;
        suggestion.author = ctx.accounts.user.key();
        suggestion.title = title;
        suggestion.description = description;
        suggestion.category = category;
        suggestion.vote_count = 0;
        suggestion.timestamp = Clock::get()?.unix_timestamp;
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
        note.author = ctx.accounts.user.key();
        note.subject = subject;
        note.title = title;
        note.ipfs_hash = ipfs_hash;
        note.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn create_request(
        ctx: Context<CreateRequest>,
        subject: String,
        description: String,
    ) -> Result<()> {
        let request = &mut ctx.accounts.request;
        request.author = ctx.accounts.user.key();
        request.subject = subject;
        request.description = description;
        request.is_fulfilled = false;
        request.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateSuggestion<'info> {
    #[account(init, payer = user, space = 8 + 32 + 50 + 200 + 20 + 8 + 8)]
    pub suggestion: Account<'info, Suggestion>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpvoteSuggestion<'info> {
    #[account(mut)]
    pub suggestion: Account<'info, Suggestion>,
}

#[derive(Accounts)]
pub struct UploadNote<'info> {
    #[account(init, payer = user, space = 8 + 32 + 50 + 50 + 64 + 8)]
    pub note: Account<'info, Note>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateRequest<'info> {
    #[account(init, payer = user, space = 8 + 32 + 50 + 200 + 1 + 8)]
    pub request: Account<'info, NoteRequest>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Suggestion {
    pub author: Pubkey,
    pub title: String,
    pub description: String,
    pub category: String,
    pub vote_count: u64,
    pub timestamp: i64,
}

#[account]
pub struct Note {
    pub author: Pubkey,
    pub subject: String,
    pub title: String,
    pub ipfs_hash: String,
    pub timestamp: i64,
}

#[account]
pub struct NoteRequest {
    pub author: Pubkey,
    pub subject: String,
    pub description: String,
    pub is_fulfilled: bool,
    pub timestamp: i64,
}
