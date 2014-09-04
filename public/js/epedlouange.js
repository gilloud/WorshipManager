'use strict';
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var pageModified = false;

var changeDispo = function(id)
{
    pageModified = true;
    document.getElementById('pagemodified').hidden = false;
    document.getElementById('pagemodified').innerHTML = 'Page modifiée, merci de sauvegarder avant de quitter !';
    document.getElementById('pagemodified2').hidden = false;
    document.getElementById('pagemodified2').innerHTML = 'Page modifiée, merci de sauvegarder avant de quitter !';


    setColor(id);


    var split = id.split('-');

    if (split[2] === 'all')
    {
        console.log(split);
        var e = document.getElementById(id);
        var theValue = e.options[e.selectedIndex].value;
        for (var i in allCompetences)
        {
            var e = document.getElementById('UPDATE-' + split[1] + '-' + allCompetences[i]);
            if (e !== null) {
                e.value = theValue;
            }
            var e = document.getElementById('CREATE-' + split[1] + '-' + allCompetences[i]);
            if (e !== null)
            {
                e.value = theValue;
            }
            setColor('UPDATE-' + split[1] + '-' + allCompetences[i]);
            setColor('CREATE-' + split[1] + '-' + allCompetences[i]);
        }
    }


};

var allCompetences = [];
var setCompetence = function(id)
{
    allCompetences.push(id);
};

var setColor = function(id)
{
    var e = document.getElementById(id);
    if (e !== null)
    {
        var theValue = e.options[e.selectedIndex].value;

        switch (theValue)
        {
            case 'D':
                //e.style = "background-color:green;color:white;";
                e.className = 'vert';
                break;
            case 'SN':
                //e.style = 'background-color:orange;color:white;background:url(\'public/images/red-1px-1px.png\);';
                e.className = 'orange';

                break;
            case 'ND':
                //e.style = 'background-color:red;color:white;';
                e.className = 'rouge';

                break;
        }
        removeChoice(id);
    }
};

var removeChoice = function(id)
{
    var e = document.getElementById(id);
    var theValue = e.options[e.selectedIndex].value;
    if (theValue !== 'C')
    {
        $("#" + id + " option[value='C']").remove();
    }
};


var displayDatas = function(a_mail, members)
{
    var o_mail = [];
    for (var i in a_mail)
    {
        var v_exist = false;
        for (var o in o_mail)
        {
            if (o_mail[o] === a_mail[i])
            {
                v_exist = true;
            }
        }

        if (!v_exist)
        {
            o_mail.push(a_mail[i]);
        }
    }

    var v_concat = '';
    for (var i = 0; i < o_mail.length; i++)
    {
        v_concat += o_mail[i];
        if (i < o_mail.length - 1)
        {
            v_concat += ' ; ';
        }
    }
    if (v_concat === '')
    {
        v_concat = 'Pas de destinataire actuellement. Utilisez <span class="glyphicon glyphicon-ok"></span>.';
    }
    var dest = document.getElementById('destinataires');
    dest.innerHTML = v_concat;

    var summary = document.getElementById('summary');
    v_concat = '';
    for (var i in members)
    {
        v_concat += '<li>' + members[i] + '</li>';
    }
    if (v_concat === '')
    {
        v_concat = '<li>Pas de personne sélectionnée actuellement. Utilisez <span class="glyphicon glyphicon-ok"></span>.</li>';
    }
    summary.innerHTML = v_concat;
};

var mail_dest = new Array();
var members = new Array();

var addStatic = function(person, competence, id, email)
{

    members['S-' + id] = competence + ': ' + person;

    var split = email.split('AZA-AZA');
    var destinataire = split[1];
    mail_dest[id] = destinataire;
    displayDatas(mail_dest, members);

};

var delStatic = function(id)
{

    delete members['S-' + id];

    delete mail_dest[id];
    displayDatas(mail_dest, members);

};

var managegroup = function(person, competence, id, email)
{

    if (document.getElementById(id).getAttribute('class') === 'glyphicon glyphicon-ok')
    {
        document.getElementById(id).setAttribute('class', 'glyphicon glyphicon-remove');

        addStatic(person, competence, id, email);

    } else
    {
        document.getElementById(id).setAttribute('class', 'glyphicon glyphicon-ok');
        delStatic(id);

    }
    return false;
};

var closeMe = function(id)
{
    document.getElementById(id).setAttribute('hidden', 'hidden');
};

var lockSelect = function(id)
{
    document.getElementById(id).setAttribute('disabled', 'disabled');

};

var displayDatasEmpty = function()
{
    displayDatas(mail_dest, members);
};