import { 
    Bolt, LayoutDashboard, WashingMachine, 
    ArrowLeftRight, UsersRound, SquarePen, 
    OctagonAlert, ChevronRight, Settings, 
  } from 'lucide-react';
  import './style.css'; // Sử dụng CSS module hoặc global CSS
  import { Link } from 'react-router-dom';
  

  
  function Sidebar() {
 
    return (
        <div className="sidebar">
        <div className='title'>
            <Bolt className='icon'/>
            <h1>ILM Dashboard</h1>
        </div>
        <div className="navigationBar">
            <ul>
                <li>
                    <LayoutDashboard />
                    <Link to="/" className='link'>Dashboard</Link>
                    <ChevronRight />
                </li>
                <li>
                    <WashingMachine />
                    <Link to="/machine-status" className='link'>Machine Status</Link>
                    <ChevronRight />
                </li>
                <li>
                    <ArrowLeftRight />
                    <Link to="/revenue" className='link'>Revenue</Link>
                    <ChevronRight />
                </li>
                <li>
                    <UsersRound />
                    <Link to="/user-info" className='link'>User Information</Link>
                    <ChevronRight />
                </li>
                <li>
                    <SquarePen />
                    <Link to="/change" className='link'>Change</Link>
                    <ChevronRight />
                </li>
                <li>
                    <OctagonAlert />
                    <Link to="/alert" className='link'>Alert</Link>
                    <ChevronRight />
                </li>
                <br/>
                <hr/>
                <li>
                    <Settings />
                    <Link to="/settings" className='link'>Settings</Link>
                    <ChevronRight />
                </li>
            </ul>
        </div>
    </div>
    )
  }
  
  export default Sidebar;
  