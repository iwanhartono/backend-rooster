import express from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const app = express();
app.use(express.json()); // parse JSON request bodies

// GET all privacy description list
app.get("/privacy-descriptions", async (req, res) => {
	const { data, error } = await supabase
    	.from("privacy_description_list")
		.select("*")
		.order("ordering_number", { ascending: true });

  	if (error) return res.status(500).json({ error: error.message });
	
  	res.json(data);
});

// GET one todo
app.get("/todos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("todos").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

// CREATE a todo
app.post("/todos", async (req, res) => {
  const { title } = req.body;
  const { data, error } = await supabase
    .from("todos").insert({ title }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// UPDATE a todo
app.patch("/todos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("todos").update(req.body).eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE a todo
app.delete("/todos/:id", async (req, res) => {
  const { error } = await supabase.from("todos").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));