import Map from './components/Map';
import BurgerMenu from './components/BurgerMenu';

const dots = [
    {
        lat: 40.416775, //Madrid
        lon: -3.703790,
        color: '#ffb619',
    },
    {
        lat: 59.334591,
        lon: 18.063240,
        color: '#ffb619',
    },
]

const lines = [
    {
        color: '#ffb619',
        from: {
            lat: 47.497913, //Budapest
            lon: 19.040236,
        },
        to: {
            lat: 51.509865, //London
            lon: -0.118092
        }
    },
]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  return (
    <div 
      className=' w-full flex justify-between 
                  bg-bgGray text-wiseNavyBlue 
                  px-[2vw] pt-5'
    >
      <div>
        <BurgerMenu />
        <Map
         lines={lines}
         dots={dots} 
        />
      </div>
    </div>
  );
}

export default App;