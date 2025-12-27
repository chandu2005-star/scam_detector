import './App.css';
import { Routes, Route } from "react-router-dom";
import First_page from './first_page';
import Forgot_pass from './forgot_pass';
import New_pass from './new_pass';
import Home from './home';
import Sign_in from './sign';
import Text_page from './text_page';
import Screenshot_page from './screenshot_page';
import Profile from './profile';
import Edit_profile from './edit_profile';
import Complaint from './complaint';
import ViewComplaints from './viewcomplaints';
function App() {
  return (
    <Routes>
      <Route path='/' element = {<First_page />} />
      <Route path='/forgot' element={<Forgot_pass />} />
      <Route path='/new_pass' element={<New_pass />} />
      <Route path='/home' element={<Home />} />
      <Route path='/sign_in' element={<Sign_in />} />
      <Route path='/text_page' element={<Text_page />} />
      <Route path='/screenshot' element={<Screenshot_page />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/editprofile' element={<Edit_profile />} />
      <Route path='/complaint' element={<Complaint />} />
      <Route path='/view-complaints' element={<ViewComplaints />} />
    </Routes>
  );
}

export default App;
