import './App.css';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'sonner';
import Register from './components/register';



function App() {
  return (
    <RecoilRoot>
      <Toaster/>
      <Register/>
    </RecoilRoot>
  );
}

export default App;
