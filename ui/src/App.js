import "./App.css";

import Form from "./components/Form";
import Feed from "./components/Feed";
import { PostContextProvider } from "./context/PostContext";

const App = () => {
  return (
    <PostContextProvider>
      <div className="App">
        <header className="App-header">
          <h1>
            fakebird
            <small>
              {" "}
              <em>I'm a bird</em>
            </small>
          </h1>
        </header>
        <main className="App-main">
          <section>
            <Form />
          </section>
          <section>
            <Feed />
          </section>
        </main>
        <footer className="App-footer">
          <small>Not bad for a bird.</small>
        </footer>
      </div>
    </PostContextProvider>
  );
};

export default App;
