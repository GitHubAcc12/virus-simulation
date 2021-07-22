## Virus Simulation

### TODOs
Clean up-- create a class for the simulation to save the variables in, with functions to initialize/end simulations. Particles file not needed anymore, as particles were removed.

### What is going on
This application simulates the spread of a virus, like the flu, through an environment filled with hosts.
Those hosts, here represented by little blue dots, are all susceptible to the virus, and once a configuration has been loaded, they will move randomly.

Once they are infected, they will first turn purple, to show that they were exposed. After the incubation period, they will turn red, to show that they are now infective themselves.

Every 10ms, the picture is refreshed. In every picture, which shows an infected dot colliding with an uninfected one, the uninfected one gets infected with a certain, configurable likelihood.

At the end of the disease, the dot might disappear (die), or recover, and therefore become immune to the virus for a certain amount of time.

The number of infected, immune/recovered, and dead dots is collected and shown in the chart on the bottom right, which can be zoomed into by hovering.

A lot of the configurable options are entered in days, and in this simulation one day takes one second in real-time.

#### Buildings
The larger balls in the simulation are called buildings, and are supposed to represent inside-areas, that attract a lot of people (dots). Any dot, that is moving within the extended radius of a building (dotted line), will be drawn into the building. If an infective dot is drawn into the building, the building itself becomes infective. To represent the inside-area, the building is infective in its smaller extended radius (non-dotted line). If not visited by another infected dot, the building will heal within 2/3 of a day (second). A dot will not enter the same building 2 times in a row, to prevent it from getting stuck there.


### Configurable options
- Population: the number of dots this simulation contains. Caution: anything too large will likely cause performance problems.
- Immunity: the number of days each dot can't be infected after it recovered.
- Buildings: are supposed to represent inside-areas that attract passing-by people (dots). Any dot that is found in the larger radius around the building, will be drawn into it.
- Movement Speed: the speed, with which the dots move around.
- Transmission Rate: the chance, with which an uninfected dot gets infected when either colliding with an infected dot or going inside an "infected" building.
- Incubation Period: number of days it will take for an exposed dot to become infective.
- Lethality Rate: chance for a dot, at the end of its disease, to die. The alternative is to recover and become immune.
- Disease Duration: number of days for which a dot is infective. At the end, it will either die or recover.

### Start the Simulation
Once everything is configured, just hit the "Load Configuration" button, and the simulation will start. At the beginning of every run, one random dot gets selected to be initially infected. To restart, just hit the button again.



### Improvement Ideas 
- Maybe problem: one encounter that should have a fixed transmission chance has that chance every 10ms due to draw fct
- Make disease duration normal distributed
- Maybe routine? give each ball a random routine, makes it more human (eg. movement per day)
- Build Continents containing cities
- Make water between continents
- Make movement across water rare
- Create a scale of measure and adjust movement to that
- Time of day impacting movement
- Produce a plot at the end showing how long it took
- Mask feature with little masks on the balls lol
