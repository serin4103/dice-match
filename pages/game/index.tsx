import Board from "@/components/game/Board";
import DiceBuilder from "@/components/game/DiceBuilder";
import Status from "@/components/game/Status";

export default function Game() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "50px",
            }}
        >
            <Board />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Status name="Player 1" diceValue={3} color="blue" finishedCount={2} />
                <Status name="Player 2" diceValue={5} color="red" finishedCount={1} />
                <DiceBuilder
                    duration={20}
                    buildDice={(faces) =>
                        console.log("Dice built with faces:", faces)
                    }
                />
            </div>
        </div>
    );
}