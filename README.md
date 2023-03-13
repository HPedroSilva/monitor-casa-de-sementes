# Sistema de Monitoramento de Casa de Sementes

Este projeto tem como objetivo realizaro o monitoramento de umidade e temperatura de uma casa de sementes utilizando arduino e sensores DHT22. O sistema irá armazenar os dados em um banco de dados MongoDB e disponibilizá-los através de uma API para outras aplicações, como o Sistema de Gestão da Casa de Sementes (https://github.com/pedrohs21/gestao-casa-sementes).

## Tecnologias Utilizadas

- Arduino
- Sensores DHT22
- Banco de Dados MongoDB
- Node.js

## Funcionamento do Sistema

O sistema irá utilizar o Arduino para coletar as informações de umidade e temperatura do ambiente através dos sensores DHT22. Os dados coletados serão armazenados no banco de dados MongoDB. 

Uma API será utilizada para disponibilizar os dados do banco para outras aplicações, como por exemplo o Sistema de Gestão da Casa de Sementes, permitindo que ele possa acessá-los e utilizá-los para tomar decisões.

## Instalação e Configuração

Para instalar e configurar o sistema, siga os seguintes passos:

1. Clone este repositório em seu computador
2. Monte o circuito com o Arduino e os sensores DHT22
3. Conecte o Arduino ao computador e faça o upload do código presente na pasta "Arduino"
4. Instale o banco de dados MongoDB em seu computador
5. Execute a API utilizando o comando `npm start`.
