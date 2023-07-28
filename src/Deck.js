import React, { useEffect, useState } from "react";
import Card from "./Card"
import axios from "axios"

const API_BASE_URL = "https://deckofcardsapi.com/api/deck"

/** Deck: uses the deck of cards api, draws one card at a time. */
const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    // gets deck data from API on initial render 
    useEffect(function loadDeckFromAPI() {
        async function fetchData() {
            const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        fetchData();
    }, []);

    /** Draw: updates state with new card data */
    async function draw() {
        try {
            const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

            if (drawRes.data.remaining === 0) throw new Error("Deck empty!");

            const card = drawRes.data.cards[0];

            setDrawn(d => [
                ...d, {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                }
            ]);
        } catch (err) {
            alert(err);
        }
    }
    /** shuffles deck with API request and updates state */
    async function startShuffling() {
        setIsShuffling(true);
        try {
            await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
            setDrawn([]);
        } catch (err) {
            alert(err);
        } finally {
            setIsShuffling(false);
        }
    }

    /** renders draw button */
    function renderDrawBtnIfValid() {
        if (!deck) return null;

        return (
            <button
                onClick={draw}
                disabled={isShuffling}>
                DRAW
            </button>
        );
    }

    /** renders shuffle button */
    function renderShuffleBtnIfValid() {
        if (!deck) return null;

        return (
            <button
                onClick={startShuffling}
                disabled={isShuffling}>
                SHUFFLE DECK
            </button>
        );
    }

    return (
        <main>
            {renderDrawBtnIfValid()}
            {renderShuffleBtnIfValid()}

            <div>
                {drawn.map(c => (
                    <Card key={c.id} name={c.name} image={c.image} />
                ))}
            </div>
        </main>
    );

}

export default Deck;