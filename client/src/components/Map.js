import React from 'react';
import {
    ComposableMap, 
    Geographies, 
    Geography,
    ZoomableGroup,
    Line,
    Marker,
} from 'react-simple-maps';

const Map = ({lines, dots}) => {
    const [position, setPosition] = React.useState({ coordinates: [10, 52], zoom: 5 });

    function handleOnResetClick() {
        setPosition({ coordinates: [10, 52], zoom: 5 });
    }

    function handleMoveEnd(position) {
        setPosition(position);
    }

    return(
        <div className='border border-solid border-sky-500'>
            <button 
                onClick={handleOnResetClick}
                className='absolute bg-brandBlue hover:bg-brandBlueHover px-2 py-1 text-bgGray m-2 rounded bottom-8 right-10'
            >
                Reset
            </button>
            <ComposableMap>
                <ZoomableGroup
                    minZoom={5}
                    maxZoom={15}
                    zoom={position.zoom}
                    center={position.coordinates}
                    onMoveEnd={handleMoveEnd}
                >
                    <Geographies geography={'https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json'}>
                        {
                            ({geographies}) => {
                                return geographies.map((geo) => {
                                    return (
                                        <Geography 
                                            key={geo.rsmKey} 
                                            geography={geo}
                                            fill='#37517e'
                                            stroke='#f2f5f7'
                                            strokeWidth={0.2}
                                            style={{
                                                default: {outline: "none"},
                                                hover: {outline: "none"},
                                                pressed: {outline: "none"},
                                            }}    
                                        />
                                    )
                                }
                                )
                            }
                        }
                    </Geographies>

                    {
                        lines.map((line) => (
                            <Line 
                                from={[line.from.lon, line.from.lat]}
                                to={[line.to.lon, line.to.lat]}
                                stroke={line.color}
                                fill={line.color}
                                strokeWidth={1}
                                strokeLinecap='round'
                                key={`line-${line.from.lon},${line.from.lat}-${line.to.lon},${line.to.lat}`}
                            />
                        ))
                    }
                    {
                        dots.map((dot) => (
                            <Marker 
                                coordinates={[dot.lon, dot.lat]}
                                key={`dot-${dot.lon},${dot.lat}`}
                            >
                                <circle r={1} fill={dot.color} />
                            </Marker> 
                        ))
                    }
                </ZoomableGroup>
            </ComposableMap>            
        </div>
    )
};

export default Map;