const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');//requiero el modelo para crear nuevos usuarios con mongoose
//const { get } = require('http');

const app = express();
app.use(express.json());

const mongoUrl = "mongodb://127.0.0.1:27017/usersBot";

const db = mongoose.connection;

//--- Me conecto a la base de datos ---
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

//--- Despliego mensaje en consola para verificar que se conecto exitosamente (uso del event "open") ---
db.once('open', _ => {
    console.log('Database is connected to: ',mongoUrl);
})

app.post('/', (req,res) => {
    const action = req.body.queryResult.action;
    switch(action){
        case "ingresar": // -- Verifica si el usuario está registrado. Dependiendo despliega uno u otro mensaje!---
            const {email} = req.body.queryResult.parameters;

            async function getUser() {//--- Función que consulta a la base de datos si el email está registrado
                const user = await User.findOne({email:email})
                return(user);
            }
            getUser()
            .then(userResult => {

                res.json({
                    fulfillmentText: `Hola ${userResult.name},
                    
        ¿De qué criptomoneda te gustaría obtener la cotización?
                    
                1. Bitcoin - BTC
                2. Ethereum - ETH
                3. Monero - XMR`
                })
            })
            .catch(error => {
            
                res.json({
                    fulfillmentText: `Este email no se encuentra registrado!

    Por favor, debes registrarte para disfrutar de 
    CryptoCotizameNow`
                })
                console.log(error);
            })

            break;
        case "cotizar-bitcoin": // -- Maneja toda la cotización del Bitcoin

            axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR,ARS')
            .then(result => {

                axios.get('http://apilayer.net/api/live?access_key=f33056bbc62a69897908af1de63537ae&currencies=ARS&source=USD&format=1')
                .then(result2 => {

                    res.json({
                        fulfillmentText: `Cotización: Bitcoin
    
        Precio $ARS: ${result.data.ARS} (1USD = ${(result.data.ARS / result.data.USD).toFixed(2)})
        Precio USD: ${result.data.USD}
        Precio EUR: ${result.data.EUR}
                        
        Precio Coinbase.com: ${(result.data.USD * result2.data.quotes.USDARS).toFixed(2)} (1USD = ${result2.data.quotes.USDARS.toFixed(2)})

        Muchas gracias por confiar en CryptoCotizameNow`
                    })

                })
                .catch(error => {
                    res.json({
                        fulfillmentText: `Oh! Hubo un problema, te pedimos disculpas!
                        
                        Intenta consultar más tarde!`
                    })
                    console.log(error)
                })
                
                
            })
            .catch(error => {
                res.json({
                    fulfillmentText: `Oh! Hubo un problema, te pedimos disculpas!
                    Intenta consultar más tarde!`
                })
                console.log(error);
            })
            
            break;
        case "cotizar-ethereum": //--- Maneja toda la cotizacion de Ethereum
            
            axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,ARS')
            .then(result => {

                axios.get('http://apilayer.net/api/live?access_key=f33056bbc62a69897908af1de63537ae&currencies=ARS&source=USD&format=1')
                .then(result2 => {

                    res.json({
                        fulfillmentText: `Cotización: Ethereum
                        
        Precio $ARS: ${result.data.ARS} (1USD = ${(result.data.ARS / result.data.USD).toFixed(2)})
        Precio USD: ${result.data.USD}
        Precio EUR: ${result.data.EUR}
            
        Precio Coinbase.com: ${(result.data.USD * result2.data.quotes.USDARS).toFixed(2)} (1USD = ${result2.data.quotes.USDARS.toFixed(2)})
            
        Muchas gracias por confiar en CryptoCotizameNow`
                    })
                })
                .catch(error => {

                    res.json({
                        fulfillmentText: `Oh! Hubo un problema, te pedimos disculpas!
                        Intenta consultar más tarde.`
                    })
                    console.log(error);
                })
                
            })
            .catch(error => {
                res.json({
                    fulfillmentText: `Oh! Hubo un problema, te pedimos disculpas!
                    
                    Intenta consultar más tarde.`
                })
                console.log(error);
            })
            
            break;
        case "cotizar-monero": //--- Maneja toda la cotización del Monero
            
            axios.get('https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD,EUR,ARS')
            .then(result => {

                axios.get('http://apilayer.net/api/live?access_key=f33056bbc62a69897908af1de63537ae&currencies=ARS&source=USD&format=1')
                .then(result2 => {

                    res.json({
                        fulfillmentText: `Cotización: Monero
                        
        Precio $ARS: ${result.data.ARS} (1USD = ${(result.data.ARS / result.data.USD).toFixed(2)})
        Precio USD: ${result.data.USD}
        Precio EUR: ${result.data.EUR}

        Precio Coinbase.com: ${(result.data.USD * result2.data.quotes.USDARS).toFixed(2)} (1USD = ${result2.data.quotes.USDARS.toFixed(2)})
            
        Muchas gracias por confiar en CryptoCotizameNow`
                    })
                })
                .catch(error => {
                    res.json({
                        fulfillmentText: `Oh! Hubo un problema, te pedimos disculpas!
                        
                        Por favor inténtalo más tarde`
                    })
                    console.log(error);
                })
            })
            .catch(error => {
                res.json({
                    fulfillmentText: `Oh! Hubo un problema, te pedimos disculpas!
                    
                    Por favor, intentalo más tarde`
                })
                console.log(error);
            })
                
            break;
        case "registrar": //--- Muestra los datos ingresados para solicitar coonfirmación ---
            const datos = req.body.queryResult.parameters

            res.json({
                fulfillmentText: `Los datos ingresados son:

                Nombre: ${datos.name}
                Ciudad: ${datos.city}
                País: ${datos.country}
                DNI: ${datos.dni}
                Email: ${datos.email}
                
                SI -> Confirmar. Iniciar el proceso de registración
                NO -> No son correctos. Desistir ahora`
            })

            break;
        case "confirmar-registro": //--- Se activa una vez que el usuario confirma los datos ingresados ---

            const datos_user = req.body.queryResult.outputContexts[0].parameters;

            async function createdNewUser() {

                const newUser = new User({
                    name: datos_user.name.trim(),
                    city: datos_user.city.trim(),
                    country: datos_user.country.trim(),
                    dni: datos_user.dni.trim(),
                    email: datos_user.email.trim(),
                    created_at: new Date()
                })


                const userSaved = await newUser.save();
                return (userSaved);
            }

            createdNewUser()
            .then(userSaved => {
                res.json({
                    fulfillmentText: `${userSaved.name} te registraste exitosamente
                    
        Ahora podés realizar todas las consultas que necesites a CryptoCotizameNow`
                });
            })
            .catch(error => {

                res.json({
                    fulfillmentText: `Lo siento, no lograste registraste.
    Verifica que tu correo no esta ya registrado.`
                });
                console.log(error);
            })
            break;
        case "no-confirmar-registro":

                res.json({
                    fulfillmentText:`Gracias por utilizar CryptoCotizameNow.
         Que tenga un buen día!`
                })
                break;
        default:
            res.json({
                fulfillmentText: `No entiendo!`
            })
            break;

    }
});

app.get('/api/users', (req, res) => {

    async function getUsers() {//--- Función que me trae todos los usuarios registrados de la base de datos
        const users = await User.find()
        return(users);
    }
    getUsers()
    .then(result => {

        res.json({
            meta: {
                status:200,
                total: result.length +1
            },
            data: result
        })
    })
    .catch(error => {
        console.log(error);
    })

})

app.listen(8080)