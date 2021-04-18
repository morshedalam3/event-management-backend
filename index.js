const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config();


const app = express()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8080;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ossg7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error', err)
  const collection = client.db("eventsmanagement").collection("events");
  const speakerCollection = client.db("eventsmanagement").collection("speaker");
  const orderCollection = client.db("eventsmanagement").collection("order");
  const reviewCollection = client.db("eventsmanagement").collection("review");
  const adminCollection = client.db("eventsmanagement").collection("admin");
  console.log('connected successfully')

  app.post('/submitOrder', (req, res) => {
    const data = req.body;
    console.log(data);
    orderCollection.insertOne(data)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/orderList', (req, res) => {
    orderCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/orderedEvent', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, items) => {
      console.log('order', items)
      res.send(items)
  })
  })

  app.get('/event', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.delete('/deleteService/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
  collection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
})

  app.get('/speaker', (req, res) => {
    speakerCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/review', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/events', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })
 
//update Status
app.patch('/update:id', (req, res) => {
  orderCollection.updateOne({_id: ObjectID(req.params.id)},
  {
    $set:{status: req.body.value}
  })
  .then(result =>{
    console.log(result)
    res.send(result.modifiedCount > 0)
  })
})

  //admin verified
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
          console.log(admin)
            res.send(admin.length > 0);
        })
})
})

app.get('/', (req, res) => {
  res.send("Welcome to Event management Server");
})

app.post('/addevent', (req, res) => {
  const data = req.body;
  console.log(data);
  client.connect(err => {
    const collection = client.db("eventsmanagement").collection("events");
    collection.insertOne(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Filed to insert")
      } else {
        res.send(result.ops)
      }
    })
  })
})

app.post('/addAdmin', (req, res) => {
  const data = req.body;
  console.log(data);
  client.connect(err => {
    const adminCollection = client.db("eventsmanagement").collection("admin");
    adminCollection.insertOne(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Filed to insert")
      } else {
        res.send(result.ops)
      }
    })
  })
})

app.post('/addReview', (req, res) => {
  const data = req.body;
  console.log(data);
  client.connect(err => {
    const reviewCollection = client.db("eventsmanagement").collection("review");
       reviewCollection.insertOne(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Filed to insert")
      } else {
        res.send(result.ops)
      }
    });
  });
});

app.post('/addSpeaker', (req, res) => {
  const data = req.body;
  console.log(data);
  client.connect(err => {
    const speakerCollection = client.db("eventsmanagement").collection("speaker");
    speakerCollection.insertMany(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Filed to insert")
      } else {
        res.send(result.ops)
      }
    });
  });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});