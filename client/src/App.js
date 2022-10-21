import Map from './components/Map';

function App() {
  return (
    <div 
      className=' w-full flex justify-between 
                  bg-bgGray text-wiseNavyBlue 
                  px-[2vw] pt-5'
    >
      <div>
        <Map/>
      </div>
    </div>
  );
}

export default App;