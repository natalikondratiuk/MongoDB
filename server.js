const express = require( 'express' );
const bodyParser = require ( 'body-parser' ); // допомагає виправити об'єкт запиту, перш ніж він буде використовуватися. Самостійно обробляє зчитування даних тега <form>
const MongoClient = require( 'mongodb' ).MongoClient; // підключння БД MongoDB
const connectString = 'mongodb+srv://yoda:pesyk2001@cluster0.1af9z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const app = express();

MongoClient.connect( connectString,{ useUnifiedTopology : true /* видалити попередження про депресацію*/ } )
    .then( client => {
        console.log( 'Connected to Database' ); // підключння БД MongoDB
        const db = client.db( 'star-wars-quotes' ); // створення БД
        const quotesCollection = db.collection( 'quotes' ); // створення колекції (таблиці) 
        app.get( '/favicon.ico', ( req, res ) => res.status( 204 ).end() ); // express.js запобігає GET /favicon.ico (перехват помилки і повернення 204 - успішна операція)
        app.use( express.static( 'public' ) ); // загальнодоступна папка за допомогою вбудованого середнього ПЗ express.static
        app.use( bodyParser.json() ); // можливість читати JSON
        app.use( bodyParser.urlencoded( { extended : true } ) ); // повідомляє аналізатору витягувати дані з <form> і додавати їх до властивості body в об'єкті запиту
        app.set( 'view engine', 'ejs' ); // використання EJS як шаблонізатора
        app.get( '/', ( req, res ) => {
            db.collection( 'quotes' ).find().toArray() // перетворення даних у масив
                .then( results => {
                    res.render( 'index.ejs', { quotes : results } ); // передача цитат в index.ejs
                } )
                .catch( error => console.error( error ) );
        } ); // зворотній виклик: об'єкт запиту та об'єкт відповіді
        app.post( '/quotes', ( req, res ) => {
            quotesCollection.insertOne( req.body )
                .then( result => {
                    res.redirect( '/' ); // переадресація на "/"
                });
        } ); // обробка POST-запиту
        app.put( '/quotes', ( req, res ) => {
            quotesCollection.findOneAndUpdate(
                { name : 'Yoda' }, // фільтр по цитатах Йоди
                {
                    $set : {
                        name : req.body.name,
                        quote : req.body.quote
                    } // $set - заміна цитати Йоди на цитату Дарта Вейдера
                },
                {
                    upsert : true
                } // upsert - вставити документ, якщо жоден документ не може бути оновлений (бо такого документу може і не бути)
            ) // знайти та замінити один елемент
            .then( result => {
                res.json( 'Success' );
            } )
            .catch( error => console.error( error ) );
        } ); // обробка запиту PUT методом put
        app.delete( '/quotes', ( req, res ) => {
            quotesCollection.deleteOne( 
                { name : req.body.name } // видалити цитату Дарта Вейдера (ім'я прописано в Fetch)
            ) // видалення елемента з колекції
            .then( result => {
                if ( result.deletedCount === 0 ){
                    res.json( 'No quote to delete' );    
                } // if deletedCount
                res.json( `Deleted Darth Vadar's quote` );
            } )
            .catch( error => console.error( error ) );
        } ); // обробка запиту DELETE методом delete
        app.listen( 3000, function(){
            console.log( 'listening on 3000' );
        } ); // server on localhost 3000
    } )
    .catch( error => console.error( error ) );