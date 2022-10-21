import EuropeMap from './graphics/map.svg';

function App() {
  return (
    <div 
      className=' h-full w-full flex justify-between 
                  bg-bgGray text-wiseNavyBlue 
                  px-[10%] pt-5'
    >
      <div>
        SideMenu
      </div>
      <img 
        src={EuropeMap}
        className='max-h-screen'
      />
    </div>
  );
}

export default App;
