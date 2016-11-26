var Discord = require('discord.io');
var setting = require('../settings.js');
var findfile = require('../drive/findfile.js');

var bot = new Discord.Client({
    token: setting('DiscordToken'),
    autorun: true
});

var avatar = "Qk2CaAAAAAAAADYAAAAoAAAAZAAAAFkAAAABABgAAAAAAExoAADEDgAAxA4AAAAAAAAAAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f34eHhwMDAmpqadXV1VFRUOjo6JiYmGBgYDg4OCQkJBQUFBwcHDAwMFBQUICAgMDAwRkZGYmJig4ODpqamyMjI5eXl+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v74eHhs7OzfHx8S0tLJiYmEBAQBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBBwcHFBQUKysrT09Pf39/s7Oz39/f+vr6/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz83Nzcnp6eWFhYIyMjBgYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgYGICAgUlJSlpaW1tbW+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLytra2YmJiICAgAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICGhoaWFhYrKys7e3t////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7e3toqKiQkJCCgoKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBBwcHEBAQGxsbJSUlLS0tMzMzNzc3NTU1MDAwKioqIiIiGBgYDg4OBQUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwcHOTk5l5eX6Ojo////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT0qampPT09BQUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBDg4OKioqT09Pd3d3mpqat7e3zc3N29vb5ubm7Ozs7+/v8fHx8PDw7u7u6urq4uLi2NjYyMjIs7Ozl5eXdHR0Tk5OKioqDg4OAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDNTU1oKCg8vLy/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+y8vLVFRUCQkJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDHx8fVFRUkZGRxsbG6Ojo+vr6////////////////////////////////////////////////////////////////////////+vr66Ojox8fHlZWVWFhYIiIiBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAABgYGTExMxsbG/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLyj4+PHBwcAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBQUUVFRoKCg3d3d+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////+/v74ODgpaWlV1dXFxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBgYioqK8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7eWlpaBQUFAAAAAAAAAAAAAAAAAAAAAQEBIiIidnZ2zMzM+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr60NDQe3t7JCQkAQEBAAAAAAAAAAAAAAAAAAAABQUFV1dX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yMjINzc3AAAAAAAAAAAAAAAAAAAAAAAAICAggICA3Nzc/v7+/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+3d3dgICAHx8fAAAAAAAAAAAAAAAAAAAAAAAANjY2yMjI////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////urq6JiYmAAAAAAAAAAAAAAAAAAAADg4OaGho1tbW/v7+/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+1NTUZGRkDQ0NAAAAAAAAAAAAAAAAAAAAJiYmurq6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////t7e3Hx8fAAAAAAAAAAAAAAAAAAAAMDAwsLCw+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn5ra2tLy8vAAAAAAAAAAAAAAAAAAAAICAgubm5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wcHBIiIiAAAAAAAAAAAAAAAABAQEWFhY3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3NzcWVlZBAQEAAAAAAAAAAAAAAAAIyMjwsLC/////////////////////////////////////////////////////////////////////Pz80dHRp6enra2tycnJ4uLi8/Pz/f39////////////////////////////////1NTULy8vAAAAAAAAAAAAAAAACAgIdnZ28PDw////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHxeXl5CAgIAAAAAAAAAAAAAAAALy8v1NTU/////////////////////////v7+9vb25+fnz8/PsbGxoKCgwcHB9fX1////////rq6uGhoaAQEBAwMDDw8PIiIiPDw8XFxcf39/oqKiwcHB29vb7e3t+vr6////5ubmSkpKAAAAAAAAAAAAAAAACQkJg4OD9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj4hYWFCQkJAAAAAAAAAAAAAAAAR0dH29vb8PDw3t7ex8fHqamph4eHZGRkQ0NDJycnEhISBQUFAAAADQ0Nbm5u////+vr6T09PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICCwsLGxsbMTExTExMZWVlOzs7AgICAAAAAAAAAAAABgYGgICA+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj4dnZ2AgICAAAAAAAAAAAAAgICJCQkMzMzHh4eDQ0NAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgI////+vr6UFBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRUVgoKCubm56urq////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb2ycnJnZ2deHh4R0dHBQUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgoK////////urq6KSkpAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwcHPz8/1dXV////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7+/vZ2dnDw8PAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXgYGB/////////v7+3t7epKSkenp6VlZWNzc3HR0dDAwMAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdnZ2/////////////////////////////////////////////////////////////////////////////////////////////f398/Pz/Pz8////////////////////////////////////////////////////////////////////////////////////////qKioBQUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBCAgIFxcXLy8vTU1NcHBwl5eXzc3N+vr6/////////////////////////Pz88fHx3d3dw8PDoqKifn5+WlpaOjo6GxsbAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAampq////////////////////////////////////////////////////////////////////////////////////////8PDwioqKOTk5gYGB7e3t////////////////////////////////////////////////////////////////////////////////////nZ2dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEQ0NDdHR0mJiYurq619fX7Ozs+vr6/////////////////////////////////////////////////////////////////f399vb2iYmJAAAAAAAAAAAAAAAADQ0NJSUlEhISBAQEAAAAAAAAGBgYubm5////////////////////////////////////////////////////////////////////////////////////29vbVVVVBAQEAAAAAwMDT09P2dnZ////////////////////////////////////////////////////////////////////////////////3NzcMzMzAAAAAAAAAwMDDQ0NICAgOTk5V1dXKCgoAAAAAAAAAAAAAwMDnZ2d/////////////////////////////////////////////////////v7++Pj4+/v7////////////////////////////+Pj4UFBQAAAAAAAAAAAABAQEj4+P6Ojozs7Ora2tjo6OiYmJxsbG/f39////////////////////////////////////////////////////////////////////////////////xcXFNDQ0AAAAAAAAAAAAAAAAAAAAMzMzxsbG////////////////////////////////////////////////////////////////////////////////2dnZlJSUiYmJp6enx8fH4ODg8vLy////mJiYAgICAAAAAAAAAAAATExM9vb2/////////////////////f399/f3+vr6////////////6+vrgICARkZGUVFRcnJylZWVtra20tLS6Ojo9/f3////zc3NFRUVAAAAAAAAAAAAKSkp5OTk////////////////////////////////////////////////////////////////////////////////////////////////////////uLi4IyMjAAAAAAAAAAAAAAAAAAAAAAAAAAAAJycnwMDA////////////////////////////////////////////////////////////////////////////////////////////////////////////4eHhKCgoAAAAAAAAAAAAERERwcHB7+/v2NjYvb29np6efHx8W1tbQkJCWVlZxsbG////////gICAAAAAAAAAAAAAAAAAAAAABgYGFBQUKSkpRUVFZ2dnTk5OAQEBAAAAAAAAAAAAcnJy////////////////////////////////////////////////////////////////////////////////////////////////////////wMDAISEhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKioqzc3N////////////////////////////////////////////////////////////////////////////////////////////////////////+fn5ampqAAAAAAAAAAAAAAAAKioqMTExGRkZCQkJAQEBAAAAAAAAAAAAAAAAQ0ND////+fn5SUlJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ0NDhISEpqamxcXF39/f8vLy/f39////////////////////////////////////////////////////////////////////////////39/fNDQ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR0dH7e3t/////////////////////////////////////////////////////////////////////////v7+9fX15OTkzMzMrq6ujIyMaGhoSEhIHx8fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJiYm////////c3NzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICDQ0NHx8fODg4XFxcqamp+fn5////////////////////////////////////////////////////////////////////enp6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEnZ2d////////////////////////////////////////////////////////////////////y8vLbW1tPz8/JCQkEBAQBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT09P////////5eXlbGxsJycnERERBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAwMqamp////////////////////////////////////////////////////////////////8/PzOzs7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYmJi////////////////////////////////////////////////////////////////0tLSJiYmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICDAwMJCQkYmJi0tLS////////////+/v75+fnzc3Nra2tioqKZmZmRkZGKioqFRUVBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGRk////////////////////////////////////////////////////////////////+fn5V1dXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBhISE////////////////////////////////////////////////////////////////mJiYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw8PPT09XFxcfX19oaGhxMTE5OTk+/v7/////////////////////////////////////v7+9/f36enp0dHRRUVFAAAAAAAAAAAAAgICEBAQCQkJAQEBAAAAAAAAAAAAAAAAAAAAAAAAfn5+////////////////////////////////////////////////////////////////////2dnZXV1dGRkZBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAABgYGIiIieHh47Ozs////////////////////////////////////////////////////////////////s7OzCQkJAAAAAAAAAAAAAAAAAAAAAAAABgYGExMTKCgoODg4CQkJAAAAAAAAAAAAS0tL8fHx/f39////////////////////////////////////////////////////////////////////+vr6TU1NAAAAAAAAAAAAEhISr6+vvr6+mpqad3d3VVVVODg4ISEhGRkZU1NT4ODg////////////////////////////////////////////////////////////////////////+fn519fXrq6uj4+Pe3t7cXFxb29vcnJyfn5+lJSUtra24ODg/Pz8////////////////////////////////////////////////////////////////////9PT0enp6IyMjHR0dMjIyTk5Ob29vkpKStLS00dHR6enp19fXHR0dAAAAAAAAAAAATU1N+vr6////////////////////////////////////////////////////////////////////////9PT0PDw8AAAAAAAAAAAAIyMj4+Pj/////////////Pz88fHx4eHh29vb9PT0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v74+Pj39/f7u7u+vr6////////////////////4uLiISEhAAAAAAAAAAAAR0dH+Pj4////////////////////////////////////////////////////////////////////////7u7uMDAwAAAAAAAAAAAALi4u7e3t////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5ubmJiYmAAAAAAAAAAAAQkJC9/f3////////////////////////////////////////////////////////////////////////6+vrLCwsAAAAAAAAAAAANTU18PDw////////////////////////////////////////////////////////////////////+vr67e3t7+/v/Pz8/////////////////////////////////////////////////////////////////////////////////////////////////////////Pz87+/v7e3t+vr6////////////////////////////////////////////////////////////////////6enpKioqAAAAAAAAAAAAPj4+9fX1////////////////////////////////////////////////////////////////////////7OzsLS0tAAAAAAAAAAAAMzMz7+/v/////////////////////////////////////////////////////////////Pz8uLi4VlZWLy8vMzMzZmZmzMzM////////////////////////////////////////////////////////////////////////////////////////////////zc3NZmZmMzMzLi4uVVVVt7e3/Pz8////////////////////////////////////////////////////////////6+vrLCwsAAAAAAAAAAAAPDw89PT0////////////////////////////////////////////////////////////////////////8PDwNDQ0AAAAAAAAAAAAKysr6urq////////////////////////////////////////////////////////////o6OjEhISAAAAAAAAAAAAAAAAIyMjwcHB////////////////////////////////////////////////////////////////////////////////////////wsLCJCQkAAAAAAAAAAAAAAAAEhISoaGh////////////////////////////////////////////////////////////5ubmJiYmAAAAAAAAAAAAQUFB9vb2////////////////////////////////////////////////////////////////////////9vb2QUFBAAAAAAAAAAAAHx8f4ODg////////////////////////////////////////////////////////4eHhKioqAAAAAAAAAAAAAAAAAAAAAAAARkZG8vLy////////////////////////////////////////////////////////////////////////////////9PT0SUlJAAAAAAAAAAAAAAAAAAAAAAAAKCgo4ODg////////////////////////////////////////////////////////29vbGxsbAAAAAAAAAAAATExM+vr6/////////////////////////////////////////////////////////////////////////Pz8VVVVAAAAAAAAAAAAERERzs7O////////////////////////////////////////////////////////r6+vBQUFAAAAAAAAAAAAAAAAAAAAAAAAEhISzc3N////////////////////////////////////////////////////////////////////////////////0dHRFBQUAAAAAAAAAAAAAAAAAAAAAAAABAQErKys////////////////////////////////////////////////////////xsbGDQ0NAAAAAAAAAAAAYWFh////////////////////////////////////////////////////////////////////////////////cXFxAAAAAAAAAAAABgYGs7Oz////////////////////////////////////////////////////////nZ2dAAAAAAAAAAAAAAAAAAAAAAAAAAAACQkJvr6+////////////////////////////////////////////////////////////////////////////////xMTEDAwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAmpqa////////////////////////////////////////////////////////qqqqAwMDAAAAAAAAAAAAfX19////////////////////////////////////////////////////////////////////////////////k5OTAAAAAAAAAAAAAAAAj4+P////////////////////////////////////////////////////////uLi4CAgIAAAAAAAAAAAAAAAAAAAAAAAAGBgY1dXV////////////////////////////////////////////////////////////////////////////////2dnZGxsbAAAAAAAAAAAAAAAAAAAAAAAACAgItra2////////////////////////////////////////////////////////hoaGAAAAAAAAAAAAAAAAnZ2d////////////////////////////////////////////////////////////////////////////////t7e3BwcHAAAAAAAAAAAAZWVl////////////////////////////////////////////////////////7OzsPj4+AAAAAAAAAAAAAAAAAAAAAAAAXV1d+fn5////////////////////////////////////////////////////////////////////////////////+vr6YWFhAAAAAAAAAAAAAAAAAAAAAAAAPDw86+vr/////////////////////////////////////////////////////v7+YGBgAAAAAAAAAAAACgoKvr6+////////////////////////////////////////////////////////////////////////////////2NjYGhoaAAAAAAAAAAAAOjo68vLy////////////////////////////////////////////////////////xcXFLi4uAAAAAAAAAAAAAgICQ0ND2tra////////////////////////////////////////////////////////////////////////////////////////29vbREREAgICAAAAAAAAAAAAKysrwcHB////////////////////////////////////////////////////////8vLyOjo6AAAAAAAAAAAAHBwc29vb////////////////////////////////////////////////////////////////////////////////8fHxOjo6AAAAAAAAAAAAGBgY1tbW////////////////////////////////////////////////////////////3d3dioqKW1tbXl5elpaW5+fn////////////////////////////////////////////////////////////////////////////////////////////////6enpmJiYX19fWlpaiIiI29vb////////////////////////////////////////////////////////////2traGxsbAAAAAAAAAAAAOjo68vLy////////////////////////////////////////////////////////////////////////////////////Z2dnAAAAAAAAAAAABAQEq6ur/////////////////////////////////////////////////////////////////////f39/v7+/////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+/f39////////////////////////////////////////////////////////////////////tLS0BwcHAAAAAAAAAAAAY2Nj////////////////////////////////////////////////////////////////////////////////////////m5ubAQEBAAAAAAAAAAAAd3d3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////hISEAAAAAAAAAAAAAAAAlJSU////////////////////////////////////////////////////////////////////////////////////////y8vLERERAAAAAAAAAAAAQ0ND9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr6UFBQAAAAAAAAAAAADQ0Nw8PD////////////////////////////////////////////////////////////////////////////////////////7e3tNDQ0AAAAAAAAAAAAGxsb2dnZ/////////////Pz87+/v3t7ezs7Ow8PDv7+/w8PDzs7O3Nzc6+vr+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4uLiJCQkAAAAAAAAAAAAKioq5+fn////////////////////////////////////////////////////////////////////////////////////////////ZmZmAAAAAAAAAAAABQUFoKCg09PTqampfn5+VVVVNDQ0Hh4eERERCwsLCQkJCwsLERERGxsbLS0tSUlJbW1tmZmZxMTE5+fn+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////uLi4CAgIAAAAAAAAAAAAWVlZ/Pz8/////////////////////////////////////////////////////////////v7+/v7+////////////////////////np6eAQEBAAAAAAAAAAAAFhYWExMTAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBDQ0NKSkpV1dXk5OTzs7O9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////fn5+AAAAAAAAAAAAAAAAk5OT////////////////////////////////////////////////////////////8fHxiIiIeHh45ubm////////////////////ysrKEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBExMTREREj4+P19fX+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX1Q0NDAAAAAAAAAAAAERERycnJ/////////////////////////////////////////////////////////v7+gICAAwMDAAAAZWVl+vr6////////////////4ODgHx8fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBCQkJFhYWISEhKCgoJycnISEhGBgYDQ0NBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBHBwcZGRkwcHB+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////09PTFxcXAAAAAAAAAAAANzc37+/v////////////////////////////////////////////////////////6OjoKioqAAAAAAAAHh4e3t7e////////////////4uLiICAgAAAAAAAAAAAAAAAAAgICISEhXFxclJSUvb291dXV4uLi6Ojo6Ojo4uLi2NjYxsbGra2ti4uLZGRkPDw8GhoaBQUFAAAAAAAAAAAAAAAAAAAAAAAAAAAADw8PWFhYwsLC+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////mpqaAQEBAAAAAAAAAAAAcXFx////////////////////////////////////////////////////////////29vbGhoaAAAAAAAAExMT09PT////////////////zc3NEhISAAAAAAAAAAAAExMTf39/3d3d/Pz8/////////////////////////////////////////////v7+8/Pz2NjYrKysb29vMzMzCwsLAAAAAAAAAAAAAAAAAAAAAAAAEhISbGxs29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v7WFhYAAAAAAAAAAAABgYGsLCw////////////////////////////////////////////////////////////1NTUFBQUAAAAAAAAFBQU09PT////////////////lpaWAQEBAAAAAAAAERERpaWl/f39/////////////////////////////////////////////////////////////////////v7+7e3tu7u7bW1tJCQkAgICAAAAAAAAAAAAAAAAAAAAKSkppKSk+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7eISEhAAAAAAAAAAAAJSUl4uLi////////////////////////////////////////////////////////////zMzMEBAQAAAAAAAAFxcX19fX////////////9vb2SkpKAAAAAAAAAAAAcXFx/f39/////////////////////////////////////////////////////////////////////////////////////f3939/fjo6OMDAwAwMDAAAAAAAAAAAAAAAACwsLbm5u6enp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////pqamBAQEAAAAAAAAAAAAW1tb/Pz8////////////////////////////////////////////////////////////xMTEDAwMAAAAAAAAHBwc3Nzc////////////z8/PFRUVAAAAAAAAERERyMjI////////////////////////////////////////////////////////////////////////////////////////////////////5ubmjY2NJCQkAAAAAAAAAAAAAAAAAQEBS0tL3d3d/////////////////////////////////////////////////////////////////////////////////////////////////////////////f39YGBgAAAAAAAAAAAAAgICnp6e////////////////////////////////////////////////////////////////vb29CAgIAAAAAAAAICAg4eHh////////////j4+PAAAAAAAAAAAANTU17+/v////////////////////////////////////////////////////////////////////////////////////////////////////////////2NjYZWVlCwsLAAAAAAAAAAAAAAAAQUFB3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////4ODgJCQkAAAAAAAAAAAAGxsb19fX////////////////////////////////////////////////////////////////tbW1BgYGAAAAAAAAJSUl5ubm////////+Pj4TExMAAAAAAAAAAAAbGxs////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj4paWlJSUlAAAAAAAAAAAAAAAASEhI5OTk////////////////////////////////////////////////////////////////////////////////////////////////////paWlBAQEAAAAAAAAAAAATU1N+Pj4////////////////////////////////////////////////////////////////rKysAwMDAAAAAAAAKysr6urq////////19fXGxsbAAAAAAAABQUFrKys////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////z8/PQkJCAAAAAAAAAAAAAAAAW1tb7+/v////////////////////////////////////////////////////////////////////////////////////////////+vr6V1dXAAAAAAAAAAAAAAAAlJSU////////////////////////////////////////////////////////////////////pKSkAQEBAAAAAAAAMTEx7u7u////////oaGhAgICAAAAAAAAJCQk4ODg////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5OTkVlZWAQEBAAAAAAAAAwMDdnZ2+Pj4/////////////v7+9/f37e3t4eHh39/f6+vr/Pz8////////////////////////////////////////////////zs7OFxcXAAAAAAAAAAAAHBwc1tbW////////////////////////////////////////////////////////////////////nJycAAAAAAAAAAAAODg48vLy/////f39YGBgAAAAAAAAAAAAXV1d/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6OjoT09PAAAAAAAAAAAACQkJbm5ura2tlZWVd3d3XFxcRUVFMDAwICAgHh4eLi4uYGBgu7u7+vr6////////////////////////////////////////d3d3AAAAAAAAAAAAAAAAYGBg/Pz8////////////////////////////////////////////////////////////////////k5OTAAAAAAAAAAAAPj4+9fX1////5eXlKSkpAAAAAAAAAwMDoqKi////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1dXVJiYmAAAAAAAAAAAAAQEBAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw8PeXl57u7u////////////////////////////////2dnZIyMjAAAAAAAAAAAADAwMuLi4////////////////////////////////////////////////////////////////////////ioqKAAAAAAAAAAAARUVF9/f3////s7OzCAgIAAAAAAAAHBwc2dnZ/////////////////////////////////////////v7++vr69fX17+/v6enp4+Pj3d3d2dnZ6+vr/v7+////////////////////////////////////////////////////////////////iYmJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDU1NT3d3d////////////////////////////enp6AAAAAAAAAAAAAAAAS0tL9PT0////////////////////////////////////////////////////////////////////////gICAAAAAAAAAAAAAR0dH+Pj4+/v7ZmZmAAAAAAAAAAAAPT095+fn6+vr4+Pj2tra0NDQxMTEtbW1paWllJSUgYGBb29vXV1dTU1NPz8/MzMzKSkpISEhHBwcGBgYMTExlpaW8/Pz////////////////////////////////////////////////////////////09PTFxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAODg4ysrK////////////////////0NDQHR0dAAAAAAAAAAAACgoKr6+v////////////////////////////////////////////////////////////////////+/v77e3tV1dXAAAAAAAAAAAAHBwcnZ2denp6Dg4OAAAAAAAAAAAAFBQUNTU1LCwsIiIiGhoaEhISDAwMBgYGAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgYGX19f4eHh////////////////////////////////////////////////////////7+/vNDQ0AAAAAAAAAAAAAAAAAAAABQUFEhISISEhLi4uMzMzJSUlCQkJAAAAAAAAAAAAAAAAAAAAJiYmt7e3////////////+fn5Y2NjAAAAAAAAAAAAAAAATExM8/Pz////////////////////////////////////////////////////////////5OTkjo6OUFBQMjIyCAgIAAAAAAAAAAAAAAAAAwMDAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOjo6xsbG////////////////////////////////////////////////////9fX1PT09AAAAAAAAAAAAHh4ehISEs7Ozzs7O4uLi7Ozs8PDw5eXls7OzPj4+AAAAAAAAAAAAAAAAAAAAGhoao6Oj/Pz8////srKyDg4OAAAAAAAAAAAADg4Ot7e3////////////////////////////////////////////////////////////////PDw8AgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICBQUFDg4OGhoaGhoaCAgIAAAAAAAAAAAAAAAAHh4eoqKi+vr6////////////////////////////////////////////6+vrLS0tAAAAAAAAAAAAjo6O////////////////////////////////4eHhTk5OAAAAAAAAAAAAAAAAAAAAEBAQmJiY5eXlOzs7AAAAAAAAAAAAAAAAXl5e+Pj4////////////////////////////////////////////////////////////////CQkJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBBgYGCwsLExMTHBwcJiYmMjIyPz8/TU1NW1tba2trenp6iYmJmJiYpqamtLS0yMjI2tra29vbsLCwPj4+AAAAAAAAAAAAAAAADQ0NfHx88PDw////////////////////////////////////////ycnJERERAAAAAAAAFhYW0dHR////////////////////////////////////5ubmVVVVAQEBAAAAAAAAAAAAAAAAFRUVRkZGBAQEAAAAAAAAAAAAGxsby8vL////////////////////////////////////////////////////////////////////XV1dAwMDAAAAAAAAAAAAAAAAAAAAAAAAIyMjPz8/Tk5OXl5ecHBwgoKCk5OTpaWltbW1xMTE0dHR3Nzc5ubm7u7u9fX1+vr6/v7+////////////////////////////////////////4uLiVlZWAwMDAAAAAAAAAAAAAwMDVlZW3d3d////////////////////////////////////h4eHAAAAAAAAAAAARkZG9fX1////////////////////////////////////////6enpWVlZAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfX19/v7+////////////////////////////////////////////////////////////////////6urqbm5uBwcHAAAAAAAAAAAAAAAAAAAAWFhY4+Pj/f39/v7+////////////////////////////////////////////////////////////////////////////////////////////////7+/ve3t7DQ0NAAAAAAAAAAAAAAAANjY2w8PD////////////////////////////8/PzQUFBAAAAAAAAAAAAh4eH////////////////////////////////////////////////6enpVlZWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjIy4uLi////////////////////////////////////////////////////////////////////////////9vb2jY2NEhISAAAAAAAAAAAAAAAAAgICUFBQ29vb////////////////////////////////////////////////////////////////////////////////////////////////////////+vr6paWlICAgAAAAAAAAAAAAAAAAHR0doqKi+vr6////////////////////zc3NExMTAAAAAAAADw8PxcXF////////////////////////////////////////////////////5ubmTk5OAAAAAAAAAAAAAAAAAAAAAAAACAgIoqKi/////////////////////////////////////////////////////////////////////////////////////f39rq6uJSUlAAAAAAAAAAAAAAAAAAAANDQ0xMTE////////////////////////////////////////////////////////////////////////////////////////////////////////////x8fHOjo6AAAAAAAAAAAAAAAADQ0NfX198PDw////////////////k5OTAAAAAAAAAAAANzc37+/v////////////////////////////////////////////////////////4ODgQ0NDAAAAAAAAAAAAAAAAAAAAUVFR8/Pz////////////////////////////////////////////////////////////////////////////////////////////zc3NQUFBAQEBAAAAAAAAAAAAAAAAICAgq6ur/f39////////////////////////////////////////////////////////////////////////////////////////////////////////4ODgWlpaBAQEAAAAAAAAAAAABAQEWFhY3t7e////////+vr6U1NTAAAAAAAAAAAAdHR0////////////////////////////////////////////////////////////////1tbWNDQ0AAAAAAAAAAAAFxcXw8PD////////////////////////////////////////////////////////////////////////////////////////////////////5eXlZWVlBwcHAAAAAAAAAAAAAAAAEhISj4+P9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////8fHxf39/Dg4OAAAAAAAAAAAAAAAANzc3xMTE////3NzcHx8fAAAAAAAACAgItbW1////////////////////////////////////////////////////////////////////zc3NPT09BAQEEhISk5OT/f39////////////////////////////////////////////////////////////////////////////////////////////////////////9fX1jY2NExMTAAAAAAAAAAAAAAAACQkJdHR07+/v////////////////////////////////////////////////////////////////////////////////////////////////////////+/v7paWlHx8fAAAAAAAAAAAAAAAAHx8fnp6ejIyMAgICAAAAAAAAKioq5ubm////////////////////////////////////////////////////////////////////////6OjosrKyx8fH+vr6/////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39srKyKSkpAAAAAAAAAAAAAAAAAwMDWlpa4+Pj////////////////////////////////////////////////////////////////////////////////////////////////////////////xcXFODg4AAAAAAAAAAAAAAAACAgIDg4OAAAAAAAAAAAAY2Nj/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0dHRRkZGAQEBAAAAAAAAAAAAAAAAQkJC0tLS////////////////////////////////////////////////////////////////////////////////////////////////////////////39/fWFhYBAQEAAAAAAAAAAAAAAAAAAAAAAAABAQEp6en////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6OjoaGhoBwcHAAAAAAAAAAAAAAAALS0tvr6+////////////////////////////////////////////////////////////////////////////////////////////////////////////8PDwfX19DQ0NAAAAAAAAAAAAAAAAAAAAFBQU0dHR////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb2jo6OFBQUAAAAAAAAAAAAAAAAHBwcpaWl/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////////+vr6oqKiHR0dAAAAAAAAAAAAAAAABQUFkpKS/f39/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39srKyKCgoAAAAAAAAAAAAAAAADw8PiIiI9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////w8PDNTU1AAAAAAAAAAAAAAAADw8PhoaG9PT0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0NDQREREAQEBAAAAAAAAAAAABwcHaWlp6enp////////////////////////////////////////////////////////////////////////////////////////////////////////////3NzcVFRUAwMDAAAAAAAAAAAABgYGZWVl5+fn////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5+fnZ2dnBwcHAAAAAAAAAAAAAQEBS0tL19fX////////////////////////////////////////////////////////////////////////////////////////////////////////////7+/veXl5CwsLAAAAAAAAAAAAAQEBR0dH1NTU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX1jY2NExMTAAAAAAAAAAAAAAAALi4uurq6/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////+vr6np6eGBgYAAAAAAAAAAAAAAAALS0tvLy8/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39sbGxJycnAAAAAAAAAAAAAAAAFhYWkZGR9vb2/////////////////////////////////////////////////////////////////////////////////////////////f39+fn59PT06urqY2NjAAAAAAAAAAAAAAAAAAAAGxsboaGh+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////z8/PQ0NDAQEBAAAAAAAAAAAABwcHa2tr7Ozs/////////////////////////////////////f39+fn59PT07Ozs5OTk2dnZzc3Nv7+/sLCwn5+fjo6OfHx8a2trWVlZSUlJOjo6KioqDQ0NAAAAAAAAAAAAAAAAAAAAAAAADQ0NkZGR/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5ubmZWVlBgYGAAAAAAAAAAAAAgICTExMtLS01tbWz8/Purq6pqaml5eXiIiIeHh4aGhoWVlZSkpKPDw8Ly8vIyMjGRkZEBAQCQkJBAQEAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALCws6enp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX1iIiIDw8PAAAAAAAAAAAAAAAACAgIFRUVEhISCAgIAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQUFdHR0+vr6/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz8pKSkHBwcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICBgYGCwsLEhISGhoaIyMjMTExQ0NDXV1doKCg8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wsLCOjo6AQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICBgYGCgoKEBAQGBgYIiIiLS0tOTk5R0dHVlZWZmZmdnZ2h4eHl5eXp6ent7e3xMTE0NDQ2tra5OTk7u7u9/f3/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/fZ2dnERERAAAAAgICDQ0NGhoaKCgoODg4SUlJWlpabW1tf39/kZGRo6Ojs7Ozw8PD0NDQ3d3d5+fn8PDw9/f3/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////"

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")", "ready");
    bot.editUserInfo({
        avatar: avatar, //Optional
        email: 'madelk@gmail.com' //Optional
            //new_password: 'supersecretpass123', //Optional
            //password: 'supersecretpass', //Required
            //username: 'Yuna' //Optional
    });
});
bot.on('message', function(user, userID, channelID, message, event) {
    try {
        if (event.d.author.bot) {
            return;
        }
        if (message[0] != "!") {
            return;
        }
        var payload = {
            user: user,
            userID: userID,
            channelID: channelID,
            message: message,
            event: event,
            moduleName: message.split(" ")[0].replace("!", "").toLowerCase(),
            command: message.split(" ")[1]
        };
        HandleBotCommand(payload);
    }
    catch (ex) {
        console.error('errorwithbotonmessage', ex)
    }
});
bot.on('disconnected', function() {
    console.log("Bot disconnected reconnecting");
    bot.connect();
});

function HandleBotCommand(payload) {
    if (payload.moduleName == "gif") {
        findfile(payload.command, function(file) {
            bot.sendMessage({
                to: payload.channelID,
                message: "Here you go " + payload.user + " I found " + file.name + ": https://kagifs.herokuapp.com" + file.path
            });
        });
    }
}
