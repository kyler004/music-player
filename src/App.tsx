import { Player } from './components/Player';
import { sampleSongs } from './data/songs';

function App() {
  return (
    <div className="App">
      <Player songs={sampleSongs} />
    </div>
  );
}

export default App;