import  { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import s from './Searchbar.module.css';
import { toast } from 'react-toastify';



function Searchbar ({onSubmit}){
  // state = {
  //   query: '',
  // };
  const [query, setQuery] = useState('');


  const handleQueryChange = e => {
    // this.setState({ query: e.currentTarget.value.toLowerCase() });
    setQuery(e.currentTarget.value);
  };

  const handleSubmit = e => {
    // const { query } = this.state;
    // const { onSubmit } = this.props;
    e.preventDefault();
    if (!query.trim()) {
      toast('Please, enter search query.');
      
    }
    onSubmit(query);
    // this.setState({ query: '' });
    setQuery('');
  };

    return (
      <header className={s.searchbar}>
      <form className={s.searchForm} onSubmit={handleSubmit}>
        <button type="submit" className={s.searchFormBtn}>
          <FaSearch />
        </button>
        <input
          className={s.searchFormInput}
          type="text"
          value={query}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleQueryChange}
        />
      </form>
    </header>
    );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
