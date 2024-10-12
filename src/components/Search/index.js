import React, { useState } from 'react';
import {  Search} from 'lucide-react';
import style from './style.css'
function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    return (
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="search-input">
            <i className="fas fa-search search-icon"> <Search/></i> 
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </form>
      </div>
    );
  }
  
  export default SearchBar;