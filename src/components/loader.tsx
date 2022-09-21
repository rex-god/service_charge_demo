import styles from '../styles/Loader.module.css';

const LoaderComponent = (props: any) => {
  return (
    <div  className={props.isCompletedTx ? '' : styles.loader} data-wordLoad="Please wait..."></div>
  )
}

export default LoaderComponent;