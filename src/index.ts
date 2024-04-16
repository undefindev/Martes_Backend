import server from './server'


// definimos el maldito puerto
const port = process.env.PORT || 4000


// y aqui el listenr
server.listen(port, () => {
  console.log(`REST API funcionando en el maldito puerto ${port}`)
})