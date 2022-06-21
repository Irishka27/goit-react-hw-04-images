import { useState, useEffect } from 'react'
import { fetchImg } from 'services/pixabay-api';
import Searchbar  from 'components/Searchbar';
import Modal from 'components/Modal';
import Loader from 'components/Loader';
import ImageGallery from 'components/ImageGallery';
import Error from 'components/Error';
import Button from 'components/Button';
import { ToastContainer } from 'react-toastify';


const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function App () {
  // state = {
  //   status: Status.IDLE,
  //   searchQuery: '',
  //   images: [],
  //   totalHits: 0,
  //   page: 1,
  //   error: null,
  //   showModal: false,
  //   modalImgProps: { url: '', alt: '' },
  // };
  const [status, setStatus] = useState(Status.IDLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImgProps, setModalImgProps] = useState({ url: '', alt: '' });

  // async componentDidUpdate(_, prevState) {
  //   const prevQuery = prevState.searchQuery;
  //   const nextQuery = this.state.searchQuery;

  //   if (prevQuery !== nextQuery) {
  //     await this.reset();
  //     this.setState({ status: Status.PENDING });
  //     await this.fetchImages(nextQuery);
  //   }
  // }
  useEffect(() => {
    // setStatus(Status.PENDING);
    if(!searchQuery){
      reset();
      return;
    }
    fetchImages(searchQuery);
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1) {
      fetchImages(searchQuery, page);
    }
  }, [page]);

  const fetchImages = (searchQuery, page) => {
    // const { page } = this.state;
    fetchImg(searchQuery, page)
      .then(({ hits, totalHits }) => {
        if (hits.length === 0) {
          return Promise.reject(new Error('Oops! Nothing found'));
        }
        setImages(prevImages => [...prevImages, ...hits]);
        setTotalHits(totalHits);
        setStatus(Status.RESOLVED);

        // this.setState(prevState => ({
        //   images: [...prevState.images, ...hits],
        //   totalHits,
        //   status: Status.RESOLVED,
        // })
        // );
      })
      .catch(error => {setError(error); setStatus(Status.REJECTED)});
       };

  const reset = () => {
    setPage(1);
    setImages([]);
  };

  const handleLoadMoreBtnClick = () => {
    incrementPage();
    fetchImages(searchQuery);
    scrollDown();
  };

  const incrementPage = () => {
    setPage(page => page + 1);
  };

  const scrollDown = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 500);
  };

  const handleSearchFormSubmit = query => {
    // this.setState({ searchQuery });
    setSearchQuery(query);
  };

  const toggleModal = () => {
    // this.setState(({ showModal }) => ({ showModal: !showModal }));
    setShowModal(!showModal);
  };

  const handleImgClick = ({ largeImageURL: url, tags: alt }) => {
    // this.setState({ modalImgProps: { url, alt } });
    // this.toggleModal();
    setModalImgProps({ url, alt });
    toggleModal();
  };

    // const {
    //   status,
    //   images,
    //   error,
    //   showModal,
    //   page,
    //   totalHits,
    //   modalImgProps: { url, alt },
    // } = this.state;

    const totalPages = Math.ceil(totalHits / 12);
    return (
     
      <div>
        <Searchbar onSubmit={handleSearchFormSubmit} />
        {status === 'pending' && <Loader />}
        {status === 'rejected' && <Error message={error} />}
        {status === 'resolved' && (
          <div>
            {showModal && (
              <Modal onClose={toggleModal} url={modalImgProps.url} alt={modalImgProps.alt} />
            )}
            <ImageGallery images={images} openModal={handleImgClick} />
            {totalPages !== page && (
              <Button handleLoadMore={handleLoadMoreBtnClick} />
            )}
          </div>
        )}

      <ToastContainer autoClose={3000}/> 
      </div>
    );
  
}
export default App;
