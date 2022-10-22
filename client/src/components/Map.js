import React from 'react';
import {
    ComposableMap, 
    Geographies, 
    Geography,
    ZoomableGroup,
    Line,
    Marker,
} from 'react-simple-maps';
import {ImUndo} from 'react-icons/im';

const Map = ({lines, dots, onClick}) => {
    const [position, setPosition] = React.useState({ coordinates: [10, 52], zoom: 5 });

    function handleOnResetClick() {
        setPosition({ coordinates: [10, 52], zoom: 5 });
    }

    function handleMoveEnd(position) {
        setPosition(position);
    }

    return(
        <div className='border border-solid border-sky-500' onClick={onClick}>
            <button 
                onClick={handleOnResetClick}
                className='absolute bg-brandBlue hover:bg-brandBlueHover p-2 text-bgGray rounded bottom-3 right-4'
                style={{
                    display:
                        (
                            position.coordinates[0] === 10 &&
                            position.coordinates[1] === 52 &&
                            position.zoom === 5
                        ) ?
                        'none' :
                        ''
                }}
            >
                <ImUndo 
                    className={'text-bgGray h-[30px] w-[30px]'}
                />
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
                                            // className='cursor-pointer'
                                            strokeWidth={0.2}
                                            style={{
                                                default: {outline: "none"},
                                                hover: { 
                                                    outline: "none",
                                                    fill: '#2e4369',
                                                    strokeWidth: 0.3,
                                                },
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
                                strokeWidth={0.1}
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
                                <circle r={0.75} fill={dot.color} />
                            </Marker> 
                        ))
                    }
                </ZoomableGroup>
            </ComposableMap>            
        </div>
    )
};

export default Map;