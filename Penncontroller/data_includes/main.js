
// Remove command prefix
PennController.ResetPrefix(null)
DebugOff()

Header(
    newVar("Idioma").global(),
    newVar("Residencias").global(),
    newVar("ResidenciasPeriodo").global(),
    newVar("Educacion").global(),
    newVar("Edad").global(),
    newVar("Genero").global()
)
  
.log( "PROLIFIC_ID" , GetURLParameter("id") )   
.log( "Idioma" , getVar("Idioma"))
.log( "Residencias" , getVar("Residencias") )
.log( "ResidenciasPeriodo" , getVar("ResidenciasPeriodo") )
.log( "Educacion", getVar("Educacion") )
.log( "Edad" , getVar("Edad") )
.log( "Genero" , getVar("Genero") )

Sequence("consent","setcounter", "participants", "instructions", "training1","preexperiment1",randomize("experiment1"), SendResults(), "explicacion" )
SetCounter("setcounter")

// formulario de consentimiento. 
newTrial("consent",
    newHtml("consent_explanation", "consent.html")
        .cssContainer({"line-height":"1.7em"})
        .print(),
    newHtml("form", `<div class='fancy'><input name='consent' id='consent' type='checkbox'><label for='consent'>Tengo 18 años o más y he leído la información general sobre el proyecto de investigación. Doy mi consentimiento para participar en el proyecto y que mis datos sean procesados dentro de este ámbito. Además, doy mi consentimiento para todos los casos de procesamiento de datos descritos en la sección "Uso posterior de los datos".</label></div>`)
        .cssContainer({"width":"70%", "margin":"auto", "margin-bottom":"20px"})
        .print()
    ,
    newFunction( () => $("#consent").change( e=>{
        if (e.target.checked) getButton("go_to_participants").enable()._runPromises();
        else getButton("go_to_participants").disable()._runPromises();
    }) ).call()
    ,
    newButton("go_to_participants", "Empezar el experimento")
        .cssContainer({"width":"70%", "margin-bottom":"50px","margin-left":"130px"})
        .disable()
        .print()
        .wait()
)

// Informacion demografica participantes 
newTrial("participants",
    defaultText
        .cssContainer({"width":"70%","margin":"auto", "margin-bottom":"1em"})
        .print()
    ,
    newText("participant_info_header", "<div class='fancy'><h2>Datos Demográficos</h2><p>Todos los datos obtenidos serán tratados de forma estrictamente anónima y no será posible su identificación posteriormente.</p></div>")
    ,
    // lugar de residencia
    newText("<b>*Lugares en los que ha vivido: si son varios separe con comas. </b><br>(presione ENTER para continuar)")
    ,
    newTextInput("input_residencias")
        .cssContainer({"width":"70%","margin":"auto", "margin-bottom":"15px"})
        .length(50)
        .log()
        .print()
        .wait(getTextInput("input_residencias").testNot.text("") )
    ,
       // Periodo
    newText("<b>*¿Cuánto tiempo lleva viviendo en los lugares mencionados anteriormente?: si son varios separe las fechas con comas.</b><br>(presione ENTER para continuar)")
    ,
    newTextInput("input_residenciasperiodo")
        .cssContainer({"width":"70%","margin":"auto", "margin-bottom":"15px"})
        .length(50)
        .log()
        .print()
        .wait()
    ,
    // Otras lenguas maternas
    newText("<b>Otras lenguas maternas:</b> además del español<br>(presione ENTER para continuar)")
    ,
    newTextInput("input_idioma")
        .cssContainer({"width":"70%", "margin":"auto", "margin-bottom":"15px"})
        .length(50)
        .log()
        .print()
        .wait()
    ,
    // Educacion
    newText("<b>*Nivel de educación:</b> <br>(presione ENTER para continuar)")
    ,
    newTextInput("input_educacion")
        .cssContainer({"width":"70%", "margin":"auto", "margin-bottom":"30px"})
        .length(50)
        .log()
        .print()
        .wait(getTextInput("input_educacion").testNot.text(""))
    ,
    // Edad
    newText("<b>*Edad:</b><br>(presione ENTER para continuar)")
    ,
    newTextInput("input_edad")
        .cssContainer({"width":"70%", "margin":"auto", "margin-bottom":"30px"})
        .length(50)
        .log()
        .print()
        .wait(getTextInput("input_edad").testNot.text(""))
    ,
    // Genero:
    newText("<b>*Género:</b><br> (presione ENTER para continuar)")
    ,
    newTextInput("input_genero")
        .cssContainer({"width":"70%","margin":"auto","margin-bottom":"30px"})
        .length(50)
        .log()
        .print()
        .wait(getTextInput("input_genero").testNot.text(""))
    ,
    // Almacenar los inputs como var elements: 
        getVar("Residencias") .set(getTextInput("input_residencias") ),
        getVar("ResidenciasPeriodo") .set(getTextInput("input_residenciasperiodo") ),
        getVar("Idioma") .set(getTextInput("input_idioma") ),
        getVar("Educacion") .set(getTextInput("input_educacion") ),
        getVar("Edad") .set(getTextInput("input_edad") ),
        getVar("Genero") .set(getTextInput("input_genero") )
)


// Instructions
newTrial("instructions",
    newHtml("consent_explanation", "Instructions.html")
        .cssContainer({"line-height":"1.7em"})
        .print()
    ,
    newButton("go_to_exercise", "Empezar práctica")
        .cssContainer({"margin":"auto","margin-bottom":"20px"})
        .print()
        .wait()
)


//Training: 
Template("training1.csv", row=>
    newTrial("training1",
     newText("narrador-trial1", row.Narrador)
            .cssContainer({"margin":"auto","margin-bottom":"10px"})
            .print()
    ,
    newText("pregunta-trial1", row.Pregunta)
            .cssContainer({"margin":"auto","margin-bottom":"10px"})
            .print()
    ,
    newScale("escala-trial1", "1","2","3","4","5")
            .before( newText("left", "<p style='color:red;'>&#10007;</p>") )
            .after( newText("right", "<p style='color:green;'>&#10003;</p>") )
            .keys()
            .log()
            .labelsPosition("top")
            .cssContainer({ "margin":"auto","margin-bottom":"20px"})
            .print()
    ,
    newButton("go_to_next", "Continuar")
        .cssContainer({"margin":"auto"})
        .print()
        .wait(getScale("escala-trial1") .test.selected() )
    ) 
)

//pre-experimento: 
//Message: End of Practice 
newTrial("preexperiment1",
        newText("preexperimento", "<p>¡Perfecto! Con esto finalizamos la fase de entranamiento.<br> Pulse el botón de <q>continuar</q> para empezar con el experimento.  </p>")
        .cssContainer({"margin":"auto", "line-height":"1.7em"})
        .print()
    ,
    newButton("go_to_experiment", "Continuar")
        .cssContainer({"margin":"auto"})
        .print()
        .wait()
)
//Experiment1
Template("experiment1.csv", row=>
    newTrial("experiment1",
     newText("narrador-experiment1", row.Sentence)
            .cssContainer({"margin":"auto","margin-bottom":"10px"})
            .print()
    ,
    newText("pregunta-experiment1", row.Question)
            .cssContainer({"margin":"auto","margin-bottom":"10px"})
            .print()
    ,
    newScale("escala-trial1", "1","2","3","4","5")
            .before( newText("left", "<p style='color:red;'>&#10007;</p>") )
            .after( newText("right", "<p style='color:green;'>&#10003;</p>") )
            .keys()
            .log()
            .labelsPosition("top")
            .cssContainer({ "margin":"auto","margin-bottom":"20px"})
            .print()
    ,
    newButton("go_to_next", "Continuar")
        .cssContainer({"margin":"auto"})
        .print()
        .wait(getScale("escala-trial1") .test.selected() )
    ) 
    .log("Group" , row.Group)
    .log("Experiment" , row.Experiment)
    .log("ItemName" , row.ItemName)
    .log("Itemno" , row.Itemno)
    .log("Mood" , row.Mood)
    .log("Verb", row.Verb)
    .log("VerbType", row.VerbType)
)

//Explicacion del estudio: 
newTrial("explicacion", 
    newHtml("explicacion", "explicacion.html")
        .cssContainer({"line-height":"1.7em"})
        .cssContainer({"margin":"auto"})
        .print()
       ,
    newButton("void")
           .wait()
)