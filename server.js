
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require ("body-parser")

const app = express()
const port = process.env.PORT || 5000 


app.set('view engine','ejs')

app.use(expressLayouts)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

const conexao = require('./config/custom-mssql');


// Criando a rota padrao
app.get('/', function (request, response) {
    
        var requisicao = new conexao.Request();
    
        requisicao.query("select top 4 * from ingressos",
        function (codErro, RecordSet){
           if (codErro) 
               console.log("Erro no Banco de Dados: " + codErro);
           response.render("paginas/home",
                { listaDeIngressos: RecordSet["recordset"] }
           );
        
        });
    
})


app.get('/sobre', function (request, response) { 
    response.render("paginas/sobre")
})                               
                                

app.get('/contato', function (request, response) {
    response.render("paginas/contato")
    
    })
app.post('/contato', function (request, response) {

    var user = [
            { "nome":request.body.txtNome,
              "email":request.body.txtEmail,
              "msg":request.body.txtMensagem
            }
        ]

    response.render("paginas/respContato", 
          {contato:user})
    
})

app.get('/carrinho/compra/:id/:idD', function (request, response) {
    
        var idIngressos = request.params.id;
        var idData = request.params.idD;
    
        global.Carrinho = global.Carrinho  +
                          "{id:"+idIngressos+"}"
                         ",idD:"+idData+"}";
    
       var carrinho = "["+global.Carrinho+"]";
       response.render('paginas/finaliza', {Carrinho:carrinho});                     
    
    })    
    
    app.get('/carrinho/:id?', function (request, response) {
    
        console.log("Request:" + request.params.id);
        var requisicao = new conexao.Request();
        var strSql = "select * from ingressos ";
            strSql +=" where id=" + request.params.id;
    
    
        requisicao.query(strSql,
        function (codErro, RecordSet){
            if (codErro) 
                console.log("Erro no Banco de Dados: " + codErro);
            else
                response.render("paginas/carrinho",
                    { listaDeIngressos: RecordSet["recordset"] }
            );
        
        })
        
    })

app.listen(port, function (request, response) {
        console.log("Servidor ativo em http://localhost:" + port)
    })

