// Import necessary dependencies
import { useState } from 'react';

const NotesPage = () => {
    // State variables for title, subject, file, and link
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState(null);
    const [link, setLink] = useState('');

    // Conditional validation for the Publish button
    const isPublishEnabled = title && subject && (file || link);

    return (
        <div>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input type="text" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />

            {/* Publish button with conditional enabling */}
            <button disabled={!isPublishEnabled}>Publish</button>

            {/* Removed asChild from DialogTrigger */}
            {/* Assuming DialogTrigger is part of your codebase, update it accordingly */}
            {/* <DialogTrigger>Open Dialog</DialogTrigger> */}
        </div>
    );
};

export default NotesPage;
