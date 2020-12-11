import logo from '../logotipo.svg';

export const Preloader = () => {
    return (
        <div className="preloader">
            <img className="img" src={logo} alt="preloder" />
        </div>
    )
}