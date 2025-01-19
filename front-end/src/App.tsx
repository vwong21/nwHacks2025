import Home from './home';
import Signup from './signup';
import Login from './login';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import { UserProvider } from './UserContext';

function App() {

  return (
	<UserProvider>
    	<Router>
    	  <div>
     	   <section>                              
     	       <Routes>                                                                        <Route path="/" element={<Home/>}/>
      	         <Route path="/signup" element={<Signup/>}/>
     	          <Route path="/login" element={<Login/>}/>
     	       </Routes>                    
   	     </section>
  	    </div>
  	  </Router>
	</UserProvider>
  );
}

export default App;