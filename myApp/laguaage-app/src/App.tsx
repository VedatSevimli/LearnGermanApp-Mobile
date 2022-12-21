import './App.scss';
import {Header} from '../src/components/header/Header'
import { Main } from './components/Main';
import { Route, Routes } from 'react-router-dom';
import { Reading } from './components/pages/Reading/Reading';
import { Listening } from './components/pages/Listening/Listening';
import { Quiz } from './components/pages/Quiz/Quiz';
import { NoMatch } from './NoMatch';
import { Words } from './components/pages/Words/Words';
import { Home } from './components/pages/Home/Home';

function App() {
  return (
    <div className="App">
       <Header/>
       <Routes>
      <Route path='/' element={<Main/>}>
            <Route index path='home' element={<Home/>}/>
            <Route path='reading' element={<Reading/>}/>
            <Route path='listening' element={<Listening/>}/>
            <Route path='/words' element={<Words/>}/>
            <Route path='quiz' element={<Quiz/>}/>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
