import React, { Component } from 'react'
import { fetchImg } from 'services/pixabay-api';
import Searchbar  from 'components/Searchbar';
import Modal from 'components/Modal';
import Loader from 'components/Loader';
import ImageGallery from 'components/ImageGallery';
import Error from 'components/Error';
import Button from 'components/Button';
import { ToastContainer } from 'react-toastify';


const PER_PAGE = 12;
const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class App extends Component {
  state = {
    status: Status.IDLE,
    searchQuery: '',
    images: [],
    totalHits: 0,
    page: 1,
    error: null,
    showModal: false,
    modalImgProps: { url: '', alt: '' },
  };

  async componentDidUpdate(_, prevState) {
    const prevQuery = prevState.searchQuery;
    const nextQuery = this.state.searchQuery;

    if (prevQuery !== nextQuery) {
      await this.reset();
      this.setState({ status: Status.PENDING });
      await this.fetchImages(nextQuery);
    }
  }

  fetchImages = query => {
    const { page } = this.state;
    fetchImg(query, page, PER_PAGE)
      .then(({ hits, totalHits }) => {
        if (hits.length === 0) {
          return Promise.reject(new Error('Oops! Nothing found'));
        }

        this.setState(prevState => ({
          images: [...prevState.images, ...hits],
          totalHits,
          status: Status.RESOLVED,
        }));
      })
      .catch(error => this.setState({ error, status: Status.REJECTED }));
  };

  reset = () => {
    this.setState({ page: 1, images: [] });
  };

  handleLoadMoreBtnClick = async () => {
    const query = this.state.searchQuery;
    await this.incrementPage();
    this.fetchImages(query);
    this.scrollDown();
  };

  incrementPage = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  scrollDown = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 500);
  };

  handleSearchFormSubmit = searchQuery => {
    this.setState({ searchQuery });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  handleImgClick = ({ largeImageURL: url, tags: alt }) => {
    this.setState({ modalImgProps: { url, alt } });
    this.toggleModal();
  };


  render() {
    const {
      status,
      images,
      error,
      showModal,
      page,
      totalHits,
      modalImgProps: { url, alt },
    } = this.state;

    const totalPages = Math.ceil(totalHits / PER_PAGE);
    return (
     
      <div>
        <Searchbar onSubmit={this.handleSearchFormSubmit} />
        {status === 'pending' && <Loader />}
        {status === 'rejected' && <Error message={error.message} />}
        {status === 'resolved' && (
          <div>
            {showModal && (
              <Modal onClose={this.toggleModal} url={url} alt={alt} />
            )}
            <ImageGallery images={images} openModal={this.handleImgClick} />
            {totalPages !== page && (
              <Button handleLoadMore={this.handleLoadMoreBtnClick} />
            )}
          </div>
        )}

      <ToastContainer autoClose={3000}/> 
      </div>
    );
  }
}
export default App;
