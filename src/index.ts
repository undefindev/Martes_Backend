import server from './server'
import colors from 'colors'


// definimos el maldito puerto
const port = process.env.PORT || 4000


// y aqui el listenr
server.listen(port, () => {
  console.log(colors.cyan.bold(`REST API funcionando en el maldito puerto ${port}`))
})