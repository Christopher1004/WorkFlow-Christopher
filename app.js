const express = require('express')
const path = require('path')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine',"ejs")
app.use(express.static('public'))
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts)
app.set('layout', 'base')
app.use((req,res,next) => {
    res.locals.currentRoute = req.path;
    next();
})

const indexRouter = require('./routes/index')
app.use('/', indexRouter)

const freelancerRouter = require('./routes/freelancer')
app.use('/freelancer', freelancerRouter)

const contratanteRouter = require('./routes/contratante')
app.use('/contratante', contratanteRouter)

const registerRouter = require('./routes/register')
app.use('/register', registerRouter)

const loginRouter = require('./routes/login')
app.use('/login', loginRouter)

const propostaRouter = require('./routes/propostas')
app.use('/propostas', propostaRouter)

const perfilRouter = require('./routes/perfil')
app.use('/perfil', perfilRouter)

const criarPropostaRouter = require('./routes/criarPropostas')
app.use('/criarProposta', criarPropostaRouter)

const criarProjetosRoutes = require('./routes/criarProjeto')
app.use('/criarProjeto', criarProjetosRoutes)



app.listen(3000, () => {
    console.log("Servidor em execução na porta 3000")
})