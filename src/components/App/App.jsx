import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Modal from '../Modal';
import s from './App.module.css';

export default function App() {
  const [imageName, setImageName] = useState('');
  const [showModal, setModal] = useState(false);
  const [stateURL, setStateURL] = useState('');

  const handleFormSubmit = query => {
    setImageName(query);
  };

  const toggleModal = url => {
    setStateURL(url);
    setModal(!showModal);
  };

  return (
    <div className={s.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery imageName={imageName} handleModal={toggleModal} />
      {showModal && <Modal onClose={toggleModal} imageURL={stateURL} />}
      <ToastContainer autoClose={3000}/>
    </div>
  );
}
