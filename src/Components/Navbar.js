import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';

const Navbar = ({ onSearch, onTypeFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editQuery, setEditQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search-history');
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data);
      } else {
        throw new Error('Failed to fetch search history');
      }
    } catch (error) {
      console.error('Error fetching search history:', error.message);
    }
  };

 const handleSearch = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/search-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchQuery }),
    });
    if (response.ok) {
      console.log('Search data saved successfully');
      fetchSearchHistory(); // Fetch updated search history
    } else {
      throw new Error('Failed to save search data');
    }
  } catch (error) {
    console.error('Error saving search data:', error.message);
  }
};
  const handleEdit = (id, query) => {
    setEditingItemId(id);
    setEditQuery(query);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/search-history/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: editQuery }),
      });
      if (response.ok) {
        console.log('Search data updated successfully');
        fetchSearchHistory(); // Fetch updated search history
        setEditingItemId(null);
        setEditQuery('');
      } else {
        throw new Error('Failed to update search data');
      }
    } catch (error) {
      console.error('Error updating search data:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/search-history/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Search data deleted successfully');
        fetchSearchHistory(); // Fetch updated search history
      } else {
        throw new Error('Failed to delete search data');
      }
    } catch (error) {
      console.error('Error deleting search data:', error.message);
    }
  };

  const saveSearchHistory = async (term) => {
    try {
      // Check if the search term already exists in the history
      const existingItem = searchHistory.find(item => item.query === term);
      if (existingItem) {
        console.log('Search history already exists for this term');
        return; // Do not save if already exists
      }

      const response = await fetch('http://localhost:5000/api/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: term }),
      });
      if (response.ok) {
        console.log('Search history saved successfully');
        // Update the search history state only if saved successfully
        fetchSearchHistory();
      } else {
        throw new Error('Failed to save search history');
      }
    } catch (error) {
      console.error('Error saving search history:', error.message);
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    onTypeFilter(type);
  };

  return (
    <div className="navbar">
      <h1 className="logo">Pokedex</h1>
      <div className="search-bar">
      <input
  type="text"
  placeholder="Search Pokemon.."
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value); // Update searchQuery state on every change
    onSearch(e.target.value); // Trigger onSearch function
    // Remove saveSearchHistory from here
  }}
/>

<button onClick={handleSearch}>Search</button>
      </div>
      <div className="filters">
        <select
          value={selectedType}
          onChange={(e) => handleTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Electric">Electric</option>
          <option value="Fire">Fire</option>
          <option value="Grass">Grass</option>
          <option value="Water">Water</option>
          <option value="Fairy">Fairy</option>
          <option value="Normal">Normal</option>
          <option value="Fighting">Fighting</option>
          <option value="Rock">Rock</option>
          <option value="Ice">Ice</option>
          <option value="Poison">Poison</option>
          <option value="Ground">Ground</option>
        </select>
      </div>
      <div className="search-history">
        <h2>Search History</h2>
        <ul>
          {searchHistory.map((item) => (
            <li key={item._id}>
              {editingItemId === item._id ? (
                <>
                  <input
                    type="text"
                    value={editQuery}
                    onChange={(e) => setEditQuery(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(item._id)}>Update</button>
                </>
              ) : (
                <>
                  {item.query}
                  <button onClick={() => handleEdit(item._id, item.query)}>Edit</button>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onTypeFilter: PropTypes.func.isRequired,
};

export default Navbar;
