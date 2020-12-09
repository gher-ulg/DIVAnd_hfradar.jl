var documenterSearchIndex = {"docs":
[{"location":"#DIVAnd-HF-Radar","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"The package DIVAnd_hfradar allow to interpolate surface current data on a regular grid. The primary use-case is for radial current measurements for high-frequency radars. But it can also be applied to any other current data (like ADCPs or drifters).","category":"page"},{"location":"#Formulation","page":"DIVAnd HF Radar","title":"Formulation","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"The package DIVAnd_hfradar aims to minimize the following cost function","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"J_mathrm vel(vec u) = u^2 + v^2 +\nsum_i=1^N frac(vec u_i cdot vec p_i - u_r_i)^2epsilon^2_i","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"where vec u = left(uvright) is the horizontal velocity vector, vec p_i is the normalized vector pointing toward the corresponding HF radar site of the i-th radial observation u_r_i, N is the number of radial observations and epsilon^2_i represents the variance of the measurements noise (normalized by the background error variance). The operator u^2 is given by (and likewise for the component v):","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"u^2=int_Omega( alpha_2 boldsymbol nablaboldsymbol nabla u \nboldsymbol nablaboldsymbol nabla u +alpha_1 boldsymbol nabla u cdot boldsymbol nabla u +\nalpha_0  u^2)  d Omega","category":"page"},{"location":"#Boundary-condition","page":"DIVAnd HF Radar","title":"Boundary condition","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"vec u cdot vec n = 0","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"where vec n is the vector normal to the coastline partial Omega. At the open ocean boundaries, this constraint is not activated, allowing therefore a flow through the domain.","category":"page"},{"location":"#Horizontal-divergence","page":"DIVAnd HF Radar","title":"Horizontal divergence","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"If we integrate the continuity equation over the surface layer and ignore the vertical velocity, we obtain an additional dynamical constraint on the horizontal velocity:","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"boldsymbol nabla cdot (h vec u) simeq 0","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"where h is the average depth of the surface mixed layer or the total water depth where total water depth is shallower and the average depth of the surface layer.  As before, this constraint is included in the cost function as a weak constraint with the following form:","category":"page"},{"location":"#Simplified-momentum-balance","page":"DIVAnd HF Radar","title":"Simplified momentum balance","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"In order to take the momentum balance into account, the time dimension must include the time dimension and the surface elevation eta is also a parameter of our cost function:","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"beginaligned\n    fracpartial upartial t = f v  - g   fracpartial etapartial x \n    fracpartial vpartial t = - f u - g   fracpartial etapartial y\nendaligned","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"where g the acceleration due to gravity.","category":"page"},{"location":"#Tutorial","page":"DIVAnd HF Radar","title":"Tutorial","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"To run these examples you need install Julia and the packages DIVAnd, DIVAnd_hfradar and PyPlot which can be installed by these julia commands:","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"using Pkg\nPkg.add(\"DIVAnd\")\nPkg.add(url=\"https://github.com/gher-ulg/DIVAnd_hfradar.jl\", rev=\"master\")\nPkg.add(\"PyPlot\")","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"In Linux, you must also install the python package matplotlib. Under Debian/Ubuntu, you can do this via the shell command:","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"sudo apt install python3-matplotlib","category":"page"},{"location":"#Data-constraint","page":"DIVAnd HF Radar","title":"Data constraint","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"In this example, we are setting up an idealized domain from spanning -1 to 1 with 10x11 grid points. The gray area on the right is a coastal wall.","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"using DIVAnd_hfradar: DIVAndrun_hfradar\nusing DIVAnd\nusing PyPlot\n\n# size of the grid\nsz = (10,11)\n\n# depth (meters)\nh = 50 * ones(sz)\n\n# land-sea mask\n# true is sea; false is land\nmask = trues(sz)\nmask[end,:] .= false\n\n# 2D grid\nxi,yi = DIVAnd.ndgrid(LinRange(-1,1,sz[1]),LinRange(-1,1,sz[2]))\n\n# scale factor; inverse of the resolution\npm = ones(sz) / (xi[2,1]-xi[1,1]);\npn = ones(sz) / (yi[1,2]-yi[1,1]);\n\n# radial observations\nrobs = [1.]\n\n# direction of the observation (from North counted clockwise)\ndirectionobs = [90.]\n\n# position of the observation\nxobs = [0.]\nyobs = [0.]\n\n# correlation length\nlen = (0.6,0.6)\n\n# data constraint\nepsilon2 = 0.001\n\n# helper function to plot results\nfunction plotres(uri,vri)\n    clf()\n    quiver(xi,yi,uri,vri, scale = 10)\n    α = directionobs*pi/180\n    quiver(xobs,yobs,robs .* sin.(α), robs .* cos.(α),color = \"r\",scale = 10)\n    contourf(xi,yi,mask,levels = [0,.5],cmap = \"gray\")\nend\n\nuri,vri = DIVAndrun_hfradar(\n    mask,h,(pm,pn),(xi,yi),(xobs,yobs),robs,directionobs,len,epsilon2)\nplotres(uri,vri)\ntitle(\"Data constraint\")\nsavefig(\"currents1.png\"); clf(); nothing # hide","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"(Image: )","category":"page"},{"location":"#Boundary-condition-2","page":"DIVAnd HF Radar","title":"Boundary condition","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"uri,vri = DIVAndrun_hfradar(\n    mask,h,(pm,pn),(xi,yi),(xobs,yobs),robs,directionobs,len,epsilon2,\n    eps2_boundary_constraint = 0.0001,\n)\nplotres(uri,vri)\ntitle(\"Data constraint and boundary condition\")\nsavefig(\"currents2.png\"); clf(); nothing # hide","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"(Image: )","category":"page"},{"location":"#Boundary-condition-and-divergence-constraint","page":"DIVAnd HF Radar","title":"Boundary condition and divergence constraint","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"uri,vri = DIVAndrun_hfradar(\n    mask,h,(pm,pn),(xi,yi),(xobs,yobs),robs,directionobs,len,epsilon2,\n    eps2_boundary_constraint = 0.001,\n    eps2_div_constraint = 0.001,\n)\nplotres(uri,vri)\ntitle(\"Data constraint, boundary condition and divergence constraint\")\nsavefig(\"currents3.png\"); clf(); nothing # hide","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"(Image: )","category":"page"},{"location":"#D-anaysis-with-time-and-the-Coriolis-force","page":"DIVAnd HF Radar","title":"3D anaysis with time and the Coriolis force","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"# 3D grid (longitude, latitude and time)\nsz = (10,11,3)\n\n# depth\nh = 50 * ones(sz)\n\n# only see points\nmask = trues(sz)\n\n# 3D grid (time is in seconds)\nxi,yi,ti = DIVAnd.ndgrid(\n    range(-1,stop=1,length=sz[1]),\n    range(-1,stop=1,length=sz[2]),\n    range(-3600,stop=3600,length=sz[3]))\n\n# scale factor; inverse of the resolution\npm = ones(size(xi)) / (xi[2,1,1]-xi[1,1,1]);\npn = ones(size(xi)) / (yi[1,2,1]-yi[1,1,1]);\npo = ones(size(xi)) / (ti[1,1,2]-ti[1,1,1]);\n\n# tobs is the time of the observations\n# other variable are as before\nrobs = [1.]\nxobs = [0.]\nyobs = [0.]\ntobs = [0.]\nlen = (0.6,0.6,0.0)\nepsilon2 = 0.1\n\nuri,vri = DIVAndrun_hfradar(\n    mask,h,(pm,pn,po),(xi,yi,ti),(xobs,yobs,tobs),robs,directionobs,len,epsilon2;\n    eps2_boundary_constraint = -1,\n    eps2_div_constraint = -1,\n    eps2_Coriolis_constraint = 1e-1,\n    f = 1e-4,\n)\n\nα = directionobs*pi/180\n\nquiver(xi[:,:,1],yi[:,:,1],uri[:,:,1],vri[:,:,1],\n       color=\"#b2c4db\",label=\"t-1 hour\");\nquiver(xi[:,:,2],yi[:,:,2],uri[:,:,2],vri[:,:,2],\n       color=\"k\",label=\"current time t\");\nquiver(xi[:,:,3],yi[:,:,3],uri[:,:,3],vri[:,:,3],\n       color=\"#b2dbbd\",label=\"t+1 hour\");\nquiver(xobs,yobs,robs .* sin.(α), robs .* cos.(α),\n       color = \"#e86966\",scale = 10,label=\"rad. obs. at time t\")\nlegend(loc=\"upper right\")\n\nsavefig(\"currents_coriolis.png\"); nothing # hide","category":"page"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"(Image: )","category":"page"},{"location":"#Reference","page":"DIVAnd HF Radar","title":"Reference","text":"","category":"section"},{"location":"","page":"DIVAnd HF Radar","title":"DIVAnd HF Radar","text":"Modules = [DIVAnd_hfradar]\nOrder   = [:function, :type]","category":"page"},{"location":"#DIVAnd.sparse_pack-Tuple{Any,Any}","page":"DIVAnd HF Radar","title":"DIVAnd.sparse_pack","text":"Create a sparse matrix which extract all elements of a state vector correspond to a true value in masks. masks is a tulple of boolean mask.\n\n\n\n\n\n","category":"method"},{"location":"#DIVAnd_hfradar.DIVAndrun_hfradar-NTuple{9,Any}","page":"DIVAnd HF Radar","title":"DIVAnd_hfradar.DIVAndrun_hfradar","text":"DIVAndrun_hfradar(mask,h,pmn,xyi,xyobs,robs,directionobs,len,epsilon2;...)\n\nHF Radar current analysis with DIVAnd and velocity constraints. The input parameters are:\n\nmask: true for sea points (false for land points) (3D-array)\nh: depth in meters (3D-array)\npmn: inverse of the local resolution (tuple of three 3D-arrays)\nxyi: coordinates of the analysis grid (tuple of three 3D-arrays)\nxyobs: coordinates of the observations (tuple of three vectors)\nrobs: radial velocity (vector)\ndirectionobs: angle α of the measured direction in degrees (vector) such that (see below)\n\nu_obs  sin(α) + v_obs  cos(α)  r_obs\n\nlen: the correlation length (a tuple of scalars)\nepsilon2: error variance of the observation relative to the error variace of\n\nthe background estimate.\n\nOptional input parameters\n\neps2_boundary_constraint (default -1):\neps2_div_constraint (default -1):\neps2_Coriolis_constraint (default -1):\nf (default 0.001 s⁻¹): Coriolis parameter. For a latitude φ, we have on Earth :\n\nbeginaligned\n    Ω = 72921  10^-5 rads \n    f = 2 Ω sin(φ)\nendaligned\n\ng (default 0. m/s²): acceleration due to gravity. If g is zero, then the surface pressure is not considered; otherwise g should be set to 9.81.\nratio (default 100): normalization factor\nlenη  (default 0, 0, 24 * 60 * 60. * 10): correlation length in space and time for the surface elevation\nresidual: an array of the same size as robs with the residual (output)\n\nConvention for the direction\n\nbearing β: angle at radar station (*) between North a measuring point (+) counted clockwise direction α: angle at measuring point between North and vector pointing to the radar station counted clockwise\n\n                ↑ /\n                |/\n         ↑      +--→ current vector (u,v)\n  North  |     / measurent point\n         |    /\n         |   /\n         |  /\n         |β/\n         |/\n         *\n   radar station\n\nSufficiently far from the poles, we have:\n\nα  β + 180\n\nThe u zonal and v meridional velocity component are related to the radial current r and direction β by:\n\nbeginaligned\nu = r sin(α) \nv = r cos(α) \nendaligned\n\nbeginaligned\nr = u  sin(α) + v  cos(α) \ntan(α) = u over v\nendaligned\n\nFor HF radar data, r is positive if the velocity is pointing towards the radar site. r, u, v, direction and β consistent with the CODAR convention of the ruv files [1,2]:\n\nA positive radial velocity is moving towards the SeaSonde, while a negative radial velocity is moving away from the SeaSonde.\n\nnote: Note\nFor the Coriolis force constrain and the surface pressure gradient constrain, one need to include a time dimension.\n\ninfo: Info\nIf you see the error ERROR: PosDefException: matrix is not positive definite; Cholesky factorization failed. you might need to check the values of your input parameters, in particular correlation, scale factors pmn and epsilon2.\n\n[1] File Formats Used for CODAR Radial Data\n\n[2] Technicians Information Page for SeaSondes\n\n\n\n\n\n","category":"method"},{"location":"#DIVAnd_hfradar.cverr-NTuple{19,Any}","page":"DIVAnd HF Radar","title":"DIVAnd_hfradar.cverr","text":"DIVAnd_hfradar.cverr(\n    xobs_all,yobs_all,robs_all,directionobs_all,flagcv_all,sitenames,\n    lonr,latr,timerange,\n    mask2d,h,\n    len,lenη,eps2,\n    eps2_boundary_constraint,\n    eps2_div_constraint,\n    eps2_Coriolis_constraint,\n    g,ratio; u = [], v = [], η = [], selection = :cv)\n\nCross-validation error\n\n\n\n\n\n","category":"method"},{"location":"#DIVAnd_hfradar.intertial_oscillation-NTuple{5,Any}","page":"DIVAnd HF Radar","title":"DIVAnd_hfradar.intertial_oscillation","text":"u size imax-1,jmax and v of size imax,jmax-1; velocities on a Arakawa C grid\n\n\n\n\n\n","category":"method"},{"location":"#DIVAnd_hfradar.stagger_u2r-Tuple{Any}","page":"DIVAnd HF Radar","title":"DIVAnd_hfradar.stagger_u2r","text":"\" Stagger from a u to a rho location in an Arakawa C grid\n\n\n\n\n\n","category":"method"},{"location":"#DIVAnd_hfradar.stagger_v2r-Tuple{Any}","page":"DIVAnd HF Radar","title":"DIVAnd_hfradar.stagger_v2r","text":"\" Stagger from a v to a rho location in an Arakawa C grid\n\n\n\n\n\n","category":"method"},{"location":"#DIVAnd_hfradar.CGrid","page":"DIVAnd HF Radar","title":"DIVAnd_hfradar.CGrid","text":"u size imax-1,jmax and v of size imax,jmax-1; velocities on a Arakawa C grid (time invariant)\n\n\n\n\n\n","category":"type"}]
}
