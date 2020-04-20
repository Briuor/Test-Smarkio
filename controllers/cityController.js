const models = require('../models'); // loads index.js
const City = models.City;
const { sequelize, Sequelize } = models;

/**
 * find 5 cities most searched, 5 cities most recently searched, then return html page template 
 * filled with that contact as response
 */
exports.index = function (req, res) {
    City.findAll({
        order: [[sequelize.col('timesSearched'), 'desc']],
        limit: 5
    }).then(searchedCities => {
        City.findAll({
            order: [[sequelize.col('updatedAt'), 'desc']],
            limit: 5
        }).then(recentCities => {
            for (let i = 0; i < recentCities.length; i++) {
                let currentDate = new Date();
                let citySearchedDate = new Date(recentCities[i].updatedAt);
                let dateDiff = (currentDate - citySearchedDate) / 1000;
                let dateType = '';
                if (dateDiff > 60) {
                    dateType = 'minuto(s)';
                    dateDiff /= 60;
                } else {
                    dateType = 'segundo(s)';
                }
                recentCities[i].time = `${Math.round(dateDiff)} ${dateType}`;
            }

            res.render('index', { recentCities, searchedCities });
        }).catch(err => {
            console.log(err);
            res.render('index', { recentCities: [], searchedCities });
        })
    }).catch(err => {
        res.render('index', { recentCities: [], searchedCities: [] });
    });
};

/**
 * find city by name
 * if not exist in database create it
 * else increment city timesSearched
 */
exports.add_city = function (req, res) {
    City.findOrCreate({
        where: { name: req.body.name },
        defaults: req.body
    }).then(response => {
        const wasCreated = response[1];
        if (wasCreated) {
            res.send(response[1]);
        }
        // if not created increment timesSearched
        else {
            City.update({
                timesSearched: Sequelize.literal('timesSearched + 1')
            }, {
                where: { id: response[0].dataValues.id }
            }).then(cityUpdated => {
                res.send(cityUpdated);
            }).catch(err => {
                res.send({ err, msg: 'Ocorreu um erro ao atualizar cidade.' });
            });
        }
    }).catch(err => {
        res.send({ err, msg: 'Ocorreu um erro ao adicionar cidade' });
    });
};

/**
 * find 5 most searched cities and return as response
 */
exports.most_searched_cities = function (req, res) {
    City.findAll({
        order: [[sequelize.col('timesSearched'), 'desc']],
        limit: 5
    }).then(cities => {
        res.send(cities);
    }).catch(err => {
        res.send({ err, msg: 'Ocorreu um erro ao buscar cidades mais pesquisadas.' });
    });
};

/**
 * find 5 most recently searched cities and return as response
 */
exports.recent_cities = function (req, res) {
    City.findAll({
        order: [[sequelize.col('updatedAt'), 'desc']],
        limit: 5
    }).then(cities => {
        res.send(cities);
    }).catch(err => {
        res.send({ err, msg: 'Ocorreu um erro ao buscar cidades recentes.' });
    });
};