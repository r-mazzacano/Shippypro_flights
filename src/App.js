import './App.css';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
//import {SearchForm} from './components/SearchForm';
import {Flights} from './components/Flights';

function App() {
  return (
    <>
    <Header/>
    <div className="container">
      <Flights />
    </div>
    <Footer />
    </>
  )
  
}

export default App;
