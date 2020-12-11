import logo from '../shippypro.svg';

export const Header = () => {
    return (
        <div className="header border-gradient-shippypro border-gradient-bottom">
            <img className="logo" src={logo} alt="logo" />
        </div>
    )
}