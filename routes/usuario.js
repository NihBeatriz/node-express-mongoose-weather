const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Incluindo Model Usuario
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

router.get('/cadastro', (req, res) => {
    res.render('usuarios/cadastro')
})

router.post('/cadastro', (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ Message: "Nome inválido!" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ Message: "Email inválido!" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ Message: "Senha inválida!" })
    }

    if (req.body.senha.length < 4) {
        erros.push({ Message: "Senha muito curta!" })
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ Message: "Senhas diferentes!" })
    }

    if (erros.length > 0) {
        res.render('usuarios/cadastro', { erros: erros })
    } else {
        Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
            if (usuario) {
                req.flash('error_msg', "Email já cadastrado!")
                res.redirect('/usuarios/cadastro')
            } else {
                var novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    //eAdmin: 1 //tirar comentário para cadastrar um admin
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            req.flash('error_msg', "Erro ao salvar usuário!")
                            res.redirect('/')
                        } else {
                            novoUsuario.senha = hash
                            novoUsuario.save().then(() => {
                                req.flash('success_msg', "Usuário cadastrado com sucesso!")
                                res.redirect('/')
                            }).catch(() => {
                                req.flash('error_msg', "Erro ao criar usuário!")
                                res.redirect('/usuarios/cadastro')
                            })
                        }
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', "Erro interno!")
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', "Deslogando com sucesso!")
    res.redirect('/')
})

module.exports = router