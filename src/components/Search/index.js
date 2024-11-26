import React, { useState } from 'react';
import { Search } from 'lucide-react';
import style from './style.css';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm); // Gọi hàm onSearch khi tìm kiếm
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearchSubmit}>
                <div className="search-input">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên máy, model, hoặc ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <span className="search-icon"><Search/></span>
                </div>
            </form>
        </div>
    );
}

export default SearchBar;
