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
const freelancerRouter = require('./routes/Freelancer/freelancer')
app.use('/freelancer', freelancerRouter)
const freelancersRouter = require('./routes/freelancers')
app.use('/freelancers', freelancersRouter)
const contratanteRouter = require('./routes/Contratante/contratante')
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

const freelancerInfo = require('./routes/Freelancer/freeInfo')
app.use('/freeInfo', freelancerInfo)
const freePassos = require('./routes/Freelancer/passosFree')
app.use('/freePassos', freePassos)

const contraInfo = require('./routes/Contratante/infoContra')
app.use('/contraInfo', contraInfo)
const contraPasso = require('./routes/Contratante/contraPasso')
app.use('/contraPasso', contraPasso)

const confirmarEmail = require('./routes/confirmacaoEmail')
app.use('/confirmarEmail', confirmarEmail)

const chat = require('./routes/chat')
app.use('/Chat', chat)

const config = require('./routes/settings')
app.use('/configuracoes', config)

app.listen(3000, () => {
    console.log("Servidor em execução na porta 3000")
})