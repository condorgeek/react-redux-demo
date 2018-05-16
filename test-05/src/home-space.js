import React, {Component} from 'react';
import Billboard from "./containers/billboard";
import Sidebar from './containers/sidebar';


const HomeSpace = (props => {
    console.log('Home Space');

    return (
        <div className=''>
            <div className='row mt-2 pl-1'>
                <div className='col-sm-9'>
                    <div className='billboard-cover'>
                        <span title="Amaru London"><img  src="/static/pics/london-mk-fb.jpg"/></span>
                    </div>

                    <div className='row mt-2 pl-1'>
                        <div className='col-sm-5'>
                            <Sidebar/>
                        </div>
                        <div className='col-sm-7'>
                            <Billboard space='home'/>
                        </div>
                    </div>

                </div>
                <div className='col-sm-3'>
                    <Sidebar/>
                </div>
            </div>
        </div>
    )
});


{/*<div className=''>*/
}
{/*<div className='row mt-2 pl-1'>*/
}
{/*<div className='col-sm-3'>*/
}
{/*<Sidebar/>*/
}
{/*</div>*/
}
{/*<div className='col-sm-6'>*/
}
{/*<HomeIndex space='home'/>*/
}
{/*</div>*/
}
{/*<div className='col-sm-3'>*/
}
{/*<Sidebar/>*/
}
{/*</div>*/
}
{/*</div>*/
}
{/*</div>*/
}


export default HomeSpace;