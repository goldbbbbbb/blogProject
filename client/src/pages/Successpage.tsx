import '../../styles/Authentication.css';
import { Link } from 'react-router-dom';

const Successpage = () => {
    return (
        <div className = 'auth-container'>
          <div className = 'auth-card-container'>
            <div className = 'auth-card'>
              <div className = 'auth-cardform'>
                <div className = 'auth-text'><Link to ='/'>已注冊成功，立即登入！</Link></div>              
              </div>         
            </div>
          </div>
        </div>
      );
}

export default Successpage;