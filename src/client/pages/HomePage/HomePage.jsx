import EmptyBoard from "../../components/EmptyBoard/EmptyBoard.jsx";
import JoinGameForm from "../../components/JoinGameForm/JoinGameForm.jsx";

function HomePage() {
  return (
    <>
      <EmptyBoard>
        <JoinGameForm />
      </EmptyBoard>
    </>
  );
}

export default HomePage;
