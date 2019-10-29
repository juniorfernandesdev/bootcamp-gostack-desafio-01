const express = require('express');

//instanciando o express
const server = express();

//configuração para o express poder retornar JSON
server.use(express.json());

//configurando a posta onde o servidor ira rodar
server.listen(3333);

//Array de projetos

const projects = [];
let countRoutes = 0;

// Middleware
function checkIdExist(req, res, next) {
    const { id } = req.params;
    const project = projects.find(x => x.id == id);

    if(!project){
        return res.status(400).json({ error: 'Project ID does exist' });
    }

    return next();
}

function countRequests(_, _, next) {
    countRoutes++;
    console.log(`Requests: ${countRoutes}`);
    return next();
}

//Middleware global
server.use(countRequests);

// CRIANDO AS ROTAS
//listar todos os projetos
server.get('/projects', (req, res) => {
    return res.json(projects);
});

//criar projeto
server.post('/projects', (req, res) => {
    const { id, title, tasks = [] } = req.body;

    projects.push({
        id,
        title,
        tasks
    });
    
    return res.json(projects);
});

// alterar projeto
server.put('/projects/:id', checkIdExist, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(x => x.id == id);

    project.title = title;

    return res.json(project);
});

//criar tarefa
server.post('/projects/:id/tasks', checkIdExist, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(x => x.id == id);

    project.tasks.push(title);

    return res.json(project);
    


});
