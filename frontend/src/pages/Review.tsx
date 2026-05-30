import { useEffect, useState } from "react";
import Form from "../components/Form";
import Scaffold from "../components/Scaffold";
import Card from "../components/ui/Card";
import { type Rewiew, rewiewPayload } from "../interfaces/Rewiew";
import Input from "../components/ui/Input";
import { SendIcon, Star } from "lucide-react";
import Button from "../components/ui/Button";
import TextArea from "../components/ui/TextArea";
import { createRewiew, getRating, getRewiews } from "../services/rewiewService";
import { formatDateTime } from "../utils/formatDateTime";

export default function Review() {
  const [rewiews, setRewiews] = useState<Rewiew[]>([]);
  const [newRewiew, setNewRewiew] = useState<Rewiew>(rewiewPayload);
  const [rating, setRating] = useState(0);
  const [update, setUpdate] = useState(0);

  async function fetchAllRewiewsAndRating() {
    getRewiews()
      .then((data) => setRewiews(data ?? []))
      .catch();
    getRating()
      .then((data) => setRating(data ?? 0))
      .catch();
  }

  async function handleSubmit() {
    createRewiew(newRewiew)
      .then(() => {
        setUpdate(update + 1);
        setNewRewiew(rewiewPayload);
      })
      .catch();
  }

  useEffect(() => {
    fetchAllRewiewsAndRating();
  }, [update]);

  return (
    <Scaffold className="px-100" prevPath="/crud-demo" nextPath="/contact">
      <h1>Recensioni</h1>

      <Form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center w-full gap-2">
          <h1>{rating}</h1>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={
                  star <= Math.floor(rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-foreground/60">
            Basato su {rewiews.length} recensioni
          </p>
        </div>

        <hr />
        <Input
          label="Nome (Opzionale)"
          value={newRewiew.author}
          onChange={(v) => setNewRewiew({ ...newRewiew, author: v })}
        />

        <div className="flex flex-col gap-2">
          <span className="flex gap-1">Valutazione</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                className="p-0 "
                variant="transparent"
                onClick={() => setNewRewiew({ ...newRewiew, stars: star })}
              >
                <Star
                  className={
                    star <= newRewiew.stars
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }
                />
              </Button>
            ))}
          </div>
        </div>

        <TextArea
          label="Commento (Opzionale)"
          value={newRewiew.comment}
          onChange={(v) => setNewRewiew({ ...newRewiew, comment: v })}
        />

        <Button type="submit">
          <SendIcon />
          Invia Recenzione
        </Button>
      </Form>

      {rewiews.map((rewiew) => (
        <Card key={rewiew.id} className=" w-full gap-2 p-3">
          <div className="flex justify-between items-center w-full">
            <p>{rewiew.author}</p>
            <p className="text-foreground/60">
              {formatDateTime(
                rewiew.creationDate || "",
                "it-IT",
                true,
                false,
                "long",
              )}
            </p>
          </div>

          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                size={15}
                key={star}
                className={
                  star <= rewiew.stars
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          <span className="text-foreground/60">{rewiew.comment}</span>
        </Card>
      ))}
    </Scaffold>
  );
}
