const update = document.querySelector( '#update-button' ); // запит PUT після натискання кнопки
const deleteButton = document.querySelector( '#delete-button' ); // запит DELETE після натискання кнопки
const messageDiv = document.querySelector( '#message' ); // запит для messageDiv після натискання кнопки

update.addEventListener( 'click', _ => {
    fetch( '/quotes', {
        method : 'put',
        headers : { 'Content-Type' : 'application/json' }, // повідомлення серверу, що надсилання даних у форматі JSON
        body : JSON.stringify( {
            name : 'Darth Vadar',
            quote : 'I find your lack of faith disturbing.'
        } ) // перетворення даних у формат JSON
    } ) //fetch - запустити метод PUT
        .then( res => {
            if( res.ok ) return res.json();
        } )
        .then( response => {
            window.location.reload( true );
        } )
} ); // click update

deleteButton.addEventListener( 'click', _ => {
    fetch( '/quotes', {
        method : 'delete',
        headers : { 'Content-Type' : 'application/json' }, // повідомлення серверу, що надсилання даних у форматі JSON
        body : JSON.stringify( {
            name : 'Darth Vadar'
        } ) // перетворення даних у формат JSON
    } ) //fetch - запустити метод PUT
        .then( res => {
            if( res.ok ) return res.json();
        } )
        .then( response => {
            if( response === 'No quote to delete' ){
               messageDiv.textContent = 'No Darth Vadar quote to delete';
            }
            else window.location.reload( true );
        } )
        .catch( console.error );
} ); // click delete