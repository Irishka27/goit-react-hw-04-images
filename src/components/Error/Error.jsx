import PropTypes from 'prop-types';
import errorImg from './error.png';
import s from './Error.module.css';

const Error = ({ message }) => {
  return (
    <div className={s.errorWrapper} role="alert">
      <p>{message}</p>
      <img src={errorImg} alt="empty" />
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;