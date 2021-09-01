# Step to be followed to solve Transient Problems.


To find current and voltage on each of the components in **Transient Analysis**.
 **Following Step to be followed to solve any problems.**
 
 > **Convert all values in SI units**
## 1. Check  whether given variable is continuity or not.
 -->continuity variables are (i<sub>L</sub>, v<sub>C</sub>, and q)
## 2. If it is continuity variable:-
---> There are two ways of finding at **t=0<sup>-</sup>**

* By observation at t<0.<br>
---> When voltage is not applied on inductor and capacitor.
* By drawing equivalent circuits at t<0.<br>8
---> When voltage is applied on inductor and capacitor.
* * Inductor should be short circuited.
* * capacitor should be open circuited.
* * Direction should be same as induced or assumed direction.
<br>
In this case:-
* * * q(0<sup>+</sup>) = q(0<sup>-</sup>).
* * * v(0<sup>+</sup>) = v(0<sup>-</sup>).
* * * i(0<sup>+</sup>) = i(0<sup>-</sup>).
> Voltage across open circuits can be calculated by **shifting method**.

## 3. If it is not continuity
* Draw the equivalent circuits at **t=0<sup>+</sup>**.
* If the circuit is **de-energized**:-
* * Inductor ---> Open circuit
* * capacitor ---> Short circuit<br>
* If the circuit is **energized**:-
* * Inductor ---> current Source
* * capacitor ---> voltage Source
* Direction will be same as t=0<sub>-</sub> of continuity variable.

## 4. Then Solve all to find current and voltage across all components.

## For derivative form
* Apply KVL at t>0.
* Obtain differential equation.
* Solve the differential equation.
* And finally solve for respective values.


