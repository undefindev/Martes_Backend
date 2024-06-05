import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {

    const whiteList = [process.env.FRONTEND_URL]

    if (process.argv[2] === '--api') {
      whiteList.push(undefined)
    }

    if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('error de cors'))
    }
  }
}

/*

 if (process.argv[2] === '--api') {
      whiteList.push(undefined)
    }

    ... no entendi ni vrga de que es esto peroo se que sirve para decir. estamos en modo api y que no choque el cors

    el 'undefined es porque thunderclient o postman no tienen un origin como tal. pero el navegador si lo tiene

*/